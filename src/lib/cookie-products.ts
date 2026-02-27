import { CookieProduct } from '@/types'

const COOKIE_PRODUCTS: CookieProduct[] = [
  {
    id: 'thin-mints',
    name: 'Thin Mints',
    price: 5.00,
    upc: '123456789012',
    description: 'Crispy cookies layered with caramel and covered with chocolate'
  },
  {
    id: 'samoas',
    name: 'Samoas (Caramel deLites)',
    price: 5.00,
    upc: '123456789013',
    description: 'Crispy cookies layered with caramel and covered with chocolate'
  },
  {
    id: 'tagalongs',
    name: 'Tagalongs (Peanut Butter Patties)',
    price: 5.00,
    upc: '123456789014',
    description: 'Crispy cookies layered with peanut butter and covered with chocolate'
  },
  {
    id: 'do-si-dos',
    name: 'Do-si-dos (Peanut Butter Sandwich)',
    price: 5.00,
    upc: '123456789015',
    description: 'Crunchy oatmeal sandwich cookies with peanut butter filling'
  },
  {
    id: 'trefoils',
    name: 'Trefoils (Shortbread)',
    price: 5.00,
    upc: '123456789016',
    description: 'Classic shortbread cookies baked to a crispy perfection'
  },
  {
    id: 'lemon-ups',
    name: 'Lemon-Ups',
    price: 5.00,
    upc: '123456789017',
    description: 'Crispy lemon cookies with inspiring messages'
  },
  {
    id: 'girl-scout-smores',
    name: 'Girl Scout S\'mores',
    price: 5.00,
    upc: '123456789018',
    description: 'Graham sandwich cookies with chocolate and marshmallow filling'
  },
  {
    id: 'toffee-tastic',
    name: 'Toffee-tastic',
    price: 5.00,
    upc: '123456789019',
    description: 'Rich, buttery cookies with toffee bits (gluten-free)'
  }
]

export function getCookieProducts(): CookieProduct[] {
  return COOKIE_PRODUCTS
}

export function getCookieByUPC(upc: string): CookieProduct | undefined {
  return COOKIE_PRODUCTS.find(product => product.upc === upc)
}

export function getCookieById(id: string): CookieProduct | undefined {
  return COOKIE_PRODUCTS.find(product => product.id === id)
}
