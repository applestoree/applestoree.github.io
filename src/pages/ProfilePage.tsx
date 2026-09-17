function ProfilePage() {
  return (
    <section className="space-y-5 px-4 py-5 pb-8">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Account</p>
        <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground">Your Apple Store Malaysia account.</p>
      </div>

      <div className="rounded-2xl border bg-secondary/50 p-5">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-background text-lg shadow-sm"></div>
        <h2 className="mt-4 text-base font-semibold">Profile coming soon</h2>
        <p className="mt-1 text-sm leading-6 text-muted-foreground">Account details and profile features will appear here.</p>
      </div>
    </section>
  )
}

export default ProfilePage
