import { useEffect, useMemo, useRef, useState } from "react";
import { createClient } from "@Supabase/supabase-js";

// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
  "https://oszqantvugvbvydlizix.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_CFjQHGQCTu-XwzQKS2YoCw_lrUkhhBK";

const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

// =====================================================
// BOTSAILOR
// =====================================================

const BOTSAILOR_API_TOKEN =
  "23554|jPN2BOmfK2izqxzHMuZ6GAdMeFFju4TWCedCrm5fad0ac045";

const BOTSAILOR_PHONE_NUMBER_ID =
  "1349098464948574";

const BOTSAILOR_SEND_URL =
  "https://botsailor.com/api/v1/whatsapp/send";

// =====================================================
// APP
// =====================================================

export default function App() {
  const [messages, setMessages] = useState([]);

  const [selectedChatId, setSelectedChatId] =
    useState(null);

  const [search, setSearch] = useState("");

  const [input, setInput] = useState("");

  const [loading, setLoading] = useState(true);

  const [sending, setSending] = useState(false);

  const [error, setError] = useState(null);

  const [sendStatus, setSendStatus] =
    useState(null);

  const [realtimeStatus, setRealtimeStatus] =
    useState("CONNECTING");

  const messagesEndRef = useRef(null);

  // ===================================================
  // HELPERS
  // ===================================================

  function getRole(message) {
    return message?.agent_name?.trim()
      ? "admin"
      : "user";
  }

  function getMessageText(message) {
    const value = message?.user_message;

    if (
      value === null ||
      value === undefined
    ) {
      return "";
    }

    if (typeof value === "string") {
      return value;
    }

    if (typeof value === "object") {
      if (typeof value.text === "string") {
        return value.text;
      }

      if (
        typeof value.message === "string"
      ) {
        return value.message;
      }

      if (typeof value.body === "string") {
        return value.body;
      }

      if (
        typeof value.content === "string"
      ) {
        return value.content;
      }

      return JSON.stringify(value);
    }

    return String(value);
  }

  function getChatName(message) {
    return (
      message?.first_name ||
      message?.chat_id ||
      "Unknown"
    );
  }

  function getInitial(name) {
    return (
      name?.trim()?.charAt(0)?.toUpperCase() ||
      "?"
    );
  }

  function formatTime(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDate(value) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  // ===================================================
  // INITIAL FETCH
  // ===================================================

  useEffect(() => {
    async function loadMessages() {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("trx_wa")
        .select("*")
        .order("created_at", {
          ascending: true,
        });

      if (error) {
        console.error(
          "trx_wa error:",
          error
        );

        setError(error.message);
      } else {
        setMessages(data || []);

        if (
          data?.length &&
          !selectedChatId
        ) {
          const firstChat = data.find(
            (item) => item.chat_id
          );

          if (firstChat) {
            setSelectedChatId(
              firstChat.chat_id
            );
          }
        }
      }

      setLoading(false);
    }

    loadMessages();
  }, []);

  // ===================================================
  // SUPABASE REALTIME
  // ===================================================

  useEffect(() => {
    const channel = supabase
      .channel("trx_wa_mobile_realtime")

      // INSERT
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trx_wa",
        },
        (payload) => {
          console.log(
            "trx_wa INSERT:",
            payload
          );

          setMessages((current) => {
            const exists = current.some(
              (item) =>
                item.wa_message_id ===
                payload.new.wa_message_id
            );

            if (exists) {
              return current;
            }

            return [
              ...current,
              payload.new,
            ];
          });
        }
      )

      // UPDATE
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "trx_wa",
        },
        (payload) => {
          console.log(
            "trx_wa UPDATE:",
            payload
          );

          setMessages((current) =>
            current.map((item) =>
              item.wa_message_id ===
              payload.new.wa_message_id
                ? payload.new
                : item
            )
          );
        }
      )

      // DELETE
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "trx_wa",
        },
        (payload) => {
          console.log(
            "trx_wa DELETE:",
            payload
          );

          setMessages((current) =>
            current.filter(
              (item) =>
                item.wa_message_id !==
                payload.old.wa_message_id
            )
          );
        }
      )

      .subscribe((status) => {
        console.log(
          "Realtime status:",
          status
        );

        setRealtimeStatus(status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ===================================================
  // GROUP CHAT
  // ===================================================

  const chats = useMemo(() => {
    const grouped = new Map();

    messages.forEach((message) => {
      if (!message.chat_id) return;

      if (!grouped.has(message.chat_id)) {
        grouped.set(message.chat_id, {
          chatId: message.chat_id,
          name: getChatName(message),
          firstName:
            message.first_name || null,
          messages: [],
          lastMessage: message,
        });
      }

      const chat =
        grouped.get(message.chat_id);

      chat.messages.push(message);

      if (
        !chat.firstName &&
        message.first_name
      ) {
        chat.firstName =
          message.first_name;

        chat.name =
          message.first_name;
      }

      if (
        new Date(
          message.created_at || 0
        ) >
        new Date(
          chat.lastMessage?.created_at ||
            0
        )
      ) {
        chat.lastMessage = message;
      }
    });

    return Array.from(
      grouped.values()
    ).sort(
      (a, b) =>
        new Date(
          b.lastMessage?.created_at || 0
        ) -
        new Date(
          a.lastMessage?.created_at || 0
        )
    );
  }, [messages]);

  // ===================================================
  // SEARCH
  // ===================================================

  const filteredChats = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return chats;
    }

    return chats.filter((chat) => {
      return (
        chat.name
          ?.toLowerCase()
          .includes(query) ||
        chat.chatId
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [chats, search]);

  // ===================================================
  // SELECTED CHAT
  // ===================================================

  const selectedChat = useMemo(() => {
    return chats.find(
      (chat) =>
        chat.chatId === selectedChatId
    );
  }, [chats, selectedChatId]);

  const conversation = useMemo(() => {
    if (!selectedChat) {
      return [];
    }

    return [...selectedChat.messages].sort(
      (a, b) =>
        new Date(a.created_at || 0) -
        new Date(b.created_at || 0)
    );
  }, [selectedChat]);

  // ===================================================
  // AUTO SCROLL
  // ===================================================

  useEffect(() => {
    if (!selectedChatId) return;

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
      });
    });
  }, [
    selectedChatId,
    conversation.length,
  ]);

  // ===================================================
  // SEND WHATSAPP MESSAGE
  // ===================================================

  async function sendMessage() {
    const text = input.trim();

    if (!text) return;

    if (!selectedChatId) return;

    if (sending) return;

    // -------------------------------------------------
    // BotSailor phone_number:
    // trx_wa.chat_id is expected to contain the
    // customer's WhatsApp phone number.
    // -------------------------------------------------

    const phoneNumber =
      String(selectedChatId)
        .replace(/\D/g, "");

    if (!phoneNumber) {
      setError(
        "Nomor WhatsApp customer tidak valid."
      );

      return;
    }

    setSending(true);
    setError(null);
    setSendStatus(null);

    try {
      // BotSailor documentation specifies
      // POST form parameters:
      //
      // apiToken
      // phone_number_id
      // message
      // phone_number

      const body =
        new URLSearchParams();

      body.append(
        "apiToken",
        BOTSAILOR_API_TOKEN
      );

      body.append(
        "phone_number_id",
        BOTSAILOR_PHONE_NUMBER_ID
      );

      body.append(
        "message",
        text
      );

      body.append(
        "phone_number",
        phoneNumber
      );

      const response = await fetch(
        BOTSAILOR_SEND_URL,
        {
          method: "POST",

          headers: {
            Accept:
              "application/json",

            "Content-Type":
              "application/x-www-form-urlencoded",
          },

          body,
        }
      );

      const result =
        await response.json();

      console.log(
        "BotSailor response:",
        result
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      if (
        String(result?.status) !== "1"
      ) {
        throw new Error(
          result?.message ||
            "BotSailor gagal mengirim pesan."
        );
      }

      // -------------------------------------------------
      // IMPORTANT:
      //
      // DO NOT INSERT INTO trx_wa.
      //
      // Webhook BotSailor akan menangani
      // pesan outgoing dan memasukkannya
      // ke trx_wa.
      // -------------------------------------------------

      setInput("");

      setSendStatus(
        "Message sent"
      );

      // Clear status after a short period.
      window.setTimeout(() => {
        setSendStatus(null);
      }, 2500);
    } catch (err) {
      console.error(
        "BotSailor send error:",
        err
      );

      setError(
        err?.message ||
          "Gagal mengirim pesan WhatsApp."
      );
    } finally {
      setSending(false);
    }
  }

  // ===================================================
  // ENTER TO SEND
  // ===================================================

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();

      sendMessage();
    }
  }

  // ===================================================
  // CHAT LIST
  // ===================================================

  if (!selectedChatId) {
    return (
      <div className="app">
        <style>{styles}</style>

        <div className="mobile-screen">
          <header className="top-header">
            <div>
              <div className="brand">
                WhatsApp
              </div>

              <div className="connection">
                ● {realtimeStatus}
              </div>
            </div>

            <button className="icon-button">
              ⋮
            </button>
          </header>

          <div className="search-container">
            <div className="search-box">
              <span>⌕</span>

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search"
              />
            </div>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <div className="chat-list">
            {loading ? (
              <div className="empty">
                Loading...
              </div>
            ) : filteredChats.length ===
              0 ? (
              <div className="empty">
                <div>
                  <div className="empty-icon">
                    💬
                  </div>

                  <div>
                    No chats
                  </div>
                </div>
              </div>
            ) : (
              filteredChats.map(
                (chat) => (
                  <button
                    key={chat.chatId}
                    className="chat-item"
                    onClick={() =>
                      setSelectedChatId(
                        chat.chatId
                      )
                    }
                  >
                    <div className="avatar">
                      {getInitial(
                        chat.name
                      )}
                    </div>

                    <div className="chat-content">
                      <div className="chat-line">
                        <div className="chat-name">
                          {chat.name}
                        </div>

                        <div className="chat-time">
                          {formatTime(
                            chat.lastMessage
                              ?.created_at
                          )}
                        </div>
                      </div>

                      <div className="chat-line">
                        <div className="last-message">
                          {getMessageText(
                            chat.lastMessage
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===================================================
  // CONVERSATION
  // ===================================================

  return (
    <div className="app">
      <style>{styles}</style>

      <div className="mobile-screen conversation-screen">
        <header className="conversation-header">
          <button
            className="back-button"
            onClick={() => {
              setSelectedChatId(null);
              setSendStatus(null);
              setError(null);
            }}
          >
            ‹
          </button>

          <div className="avatar small">
            {getInitial(
              selectedChat?.name
            )}
          </div>

          <div className="header-info">
            <div className="header-name">
              {selectedChat?.name ||
                "Unknown"}
            </div>

            <div className="header-status">
              {selectedChatId}
            </div>
          </div>

          <button className="header-action">
            ⋮
          </button>
        </header>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {sendStatus && (
          <div className="success">
            {sendStatus}
          </div>
        )}

        <main className="messages">
          {conversation.map(
            (message, index) => {
              const role =
                getRole(message);

              const currentDate =
                formatDate(
                  message.created_at
                );

              const previousDate =
                formatDate(
                  conversation[
                    index - 1
                  ]?.created_at
                );

              const showDate =
                currentDate !==
                previousDate;

              return (
                <div
                  key={
                    message.wa_message_id
                  }
                >
                  {showDate && (
                    <div className="date-divider">
                      {currentDate}
                    </div>
                  )}

                  <div
                    className={
                      `message-row ${role}`
                    }
                  >
                    <div
                      className={
                        `bubble ${role}`
                      }
                    >
                      <div className="message">
                        {getMessageText(
                          message
                        )}
                      </div>

                      <div className="message-meta">
                        {formatTime(
                          message.created_at
                        )}

                        {role === "admin" && (
                          <span className="checks">
                            ✓✓
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            }
          )}

          <div ref={messagesEndRef} />
        </main>

        <div className="input-bar">
          <textarea
            value={input}
            onChange={(event) =>
              setInput(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Message"
            rows={1}
            disabled={sending}
          />

          <button
            className="send-button"
            onClick={sendMessage}
            disabled={
              sending ||
              !input.trim()
            }
          >
            {sending ? "…" : "➤"}
          </button>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// MOBILE UI
// =====================================================

const styles = `
  * {
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      sans-serif;

    background: #e5ddd5;
  }

  button,
  input,
  textarea {
    font: inherit;
  }

  button {
    border: 0;
  }

  .app {
    width: 100%;
    height: 100dvh;
    overflow: hidden;
    background: #e5ddd5;
  }

  .mobile-screen {
    width: 100%;
    max-width: 500px;
    height: 100dvh;
    margin: 0 auto;
    overflow: hidden;

    display: flex;
    flex-direction: column;

    background: #fff;
  }

  /* =========================
     HEADER
     ========================= */

  .top-header {
    height: 64px;
    flex-shrink: 0;

    padding: 10px 16px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    background: #075e54;
    color: white;
  }

  .brand {
    font-size: 21px;
    font-weight: 700;
  }

  .connection {
    margin-top: 2px;
    font-size: 10px;
    opacity: .8;
  }

  .icon-button,
  .header-action {
    background: transparent;
    color: white;
    font-size: 24px;
    padding: 6px;
  }

  /* =========================
     SEARCH
     ========================= */

  .search-container {
    padding: 8px 12px;
    background: #075e54;
  }

  .search-box {
    height: 40px;

    border-radius: 8px;

    display: flex;
    align-items: center;
    gap: 8px;

    padding: 0 12px;

    background: white;
    color: #667781;
  }

  .search-box span {
    font-size: 22px;
  }

  .search-box input {
    width: 100%;

    border: 0;
    outline: 0;

    background: transparent;

    font-size: 14px;
  }

  /* =========================
     CHAT LIST
     ========================= */

  .chat-list {
    flex: 1;
    overflow-y: auto;
    background: white;
  }

  .chat-item {
    width: 100%;
    min-height: 74px;

    padding: 10px 14px;

    display: flex;
    align-items: center;
    gap: 12px;

    text-align: left;

    background: white;

    border-bottom:
      1px solid #f0f2f5;
  }

  .chat-item:active {
    background: #f0f2f5;
  }

  .avatar {
    width: 50px;
    height: 50px;

    flex-shrink: 0;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #dfe5e7;
    color: #54656f;

    font-size: 19px;
    font-weight: 600;
  }

  .avatar.small {
    width: 42px;
    height: 42px;
    font-size: 16px;
  }

  .chat-content {
    flex: 1;
    min-width: 0;
  }

  .chat-line {
    width: 100%;

    display: flex;
    align-items: center;
    justify-content: space-between;

    gap: 8px;
  }

  .chat-name {
    min-width: 0;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    color: #111b21;

    font-size: 16px;
    font-weight: 500;
  }

  .chat-time {
    flex-shrink: 0;

    color: #667781;
    font-size: 11px;
  }

  .last-message {
    margin-top: 5px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    color: #667781;
    font-size: 13px;
  }

  /* =========================
     CONVERSATION HEADER
     ========================= */

  .conversation-screen {
    background: #efeae2;
  }

  .conversation-header {
    height: 64px;
    flex-shrink: 0;

    padding: 8px 10px;

    display: flex;
    align-items: center;
    gap: 8px;

    background: #075e54;
    color: white;
  }

  .back-button {
    width: 32px;
    height: 42px;

    background: transparent;
    color: white;

    font-size: 34px;
    line-height: 1;
  }

  .header-info {
    flex: 1;
    min-width: 0;
  }

  .header-name {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    font-size: 16px;
    font-weight: 600;
  }

  .header-status {
    margin-top: 2px;

    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    font-size: 11px;
    opacity: .8;
  }

  /* =========================
     MESSAGES
     ========================= */

  .messages {
    flex: 1;
    min-height: 0;

    overflow-y: auto;

    padding: 14px 10px;

    background-color: #efeae2;

    background-image:
      radial-gradient(
        rgba(0,0,0,.035) 1px,
        transparent 1px
      );

    background-size: 12px 12px;
  }

  .date-divider {
    width: fit-content;

    margin: 8px auto 12px;

    padding: 5px 9px;

    border-radius: 6px;

    background: white;
    color: #667781;

    font-size: 10px;

    box-shadow:
      0 1px 1px
      rgba(0,0,0,.08);
  }

  .message-row {
    width: 100%;

    display: flex;

    margin-bottom: 4px;
  }

  .message-row.user {
    justify-content: flex-start;
  }

  .message-row.admin {
    justify-content: flex-end;
  }

  .bubble {
    max-width: 82%;

    padding:
      7px
      9px
      5px;

    border-radius: 8px;

    box-shadow:
      0 1px 1px
      rgba(0,0,0,.10);
  }

  .bubble.user {
    background: white;

    border-top-left-radius: 2px;
  }

  .bubble.admin {
    background: #d9fdd3;

    border-top-right-radius: 2px;
  }

  .message {
    color: #111b21;

    font-size: 14px;
    line-height: 1.4;

    white-space: pre-wrap;
    word-break: break-word;
  }

  .message-meta {
    display: flex;

    align-items: center;
    justify-content: flex-end;

    gap: 3px;

    margin-top: 2px;

    color: #667781;
    font-size: 9px;
  }

  .checks {
    color: #53bdeb;
    font-size: 11px;
  }

  /* =========================
     INPUT
     ========================= */

  .input-bar {
    min-height: 58px;
    flex-shrink: 0;

    padding: 8px;

    display: flex;
    align-items: flex-end;
    gap: 6px;

    background: #f0f2f5;
  }

  .input-bar textarea {
    flex: 1;
    min-width: 0;

    min-height: 42px;
    max-height: 110px;

    resize: none;

    border: 0;
    outline: 0;

    border-radius: 21px;

    padding:
      11px
      15px;

    background: white;
    color: #111b21;

    line-height: 20px;
  }

  .send-button {
    width: 42px;
    height: 42px;

    flex-shrink: 0;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #128c7e;
    color: white;

    font-size: 17px;
  }

  .send-button:disabled {
    opacity: .45;
  }

  /* =========================
     STATUS
     ========================= */

  .error {
    flex-shrink: 0;

    padding:
      8px
      12px;

    background: #fff1f0;
    color: #b42318;

    border-bottom:
      1px solid #ffd5d2;

    font-size: 12px;
  }

  .success {
    flex-shrink: 0;

    padding:
      7px
      12px;

    background: #e8f7ee;
    color: #087443;

    border-bottom:
      1px solid #b7e4c7;

    font-size: 12px;
  }

  .empty {
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    text-align: center;

    color: #667781;

    padding: 30px;
  }

  .empty-icon {
    margin-bottom: 10px;
    font-size: 40px;
  }

  @media (min-width: 501px) {
    .app {
      display: flex;
      justify-content: center;
    }

    .mobile-screen {
      box-shadow:
        0 0 30px
        rgba(0,0,0,.15);
    }
  }
`;
