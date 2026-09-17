const API_URL = 'https://jhpbtooefyzdndstlzva.supabase.co/functions/v1/get-trx-products'

export type ProductVariant = {
  id: string
  link: string
  variant_color: {
    color: string | null
    image_link: string | null
    additional_image_link: string | null
  }
  variant_size: {
    size: string | null
    price: number | null
    sale_price: number | null
  }
}

export type ProductCard = {
  item_group_id: string
  title: string
  image_link: string | null
  price: number | null
  sale_price: number | null
  product_type: string | null
  custom_label_0: string | null
  custom_label_1: string | null
  custom_label_2: string | null
}

export type ProductDetail = {
  item_group_id: string
  title: string
  description: string | null
  availability: string | null
  condition: string | null
  brand: string | null
  google_product_category: string | null
  product_type: string | null
  custom_label_0: string | null
  custom_label_1: string | null
  custom_label_2: string | null
  variants: ProductVariant[]
}

export type Product = {
  card: ProductCard
  productdetailpage: ProductDetail
}

type ProductsResponse = {
  version: string
  success: boolean
  count: number
  data: Product[]
  error?: { code: string; message: string }
}

export async function getProducts(params?: {
  item_group_id?: string
  id?: string
}): Promise<Product[]> {
  const url = new URL(API_URL)
  if (params?.item_group_id) url.searchParams.set('item_group_id', params.item_group_id)
  if (params?.id) url.searchParams.set('id', params.id)

  const response = await fetch(url)
  const body = (await response.json()) as ProductsResponse
  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? 'Unable to retrieve products.')
  }
  return body.data
}
