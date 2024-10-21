import { createWebHistory, createRouter } from 'vue-router'

import VerusBasketView from './VerusBasketView.vue'
import Home from './Home.vue'

const currencyDictionary = [
    { "currencyid": "i5w5MuNik5NtLcYmNzcvaoixooEebB6MGV", "ticker": "VRSC" },
    { "currencyid": "iGBs4DWztRNvNEJBt4mqHszLxfKTNHTkhM", "ticker": "DAI.vETH" },
    { "currencyid": "iCkKJuJScy4Z6NSDK7Mt42ZAB2NEnAE1o4", "ticker": "MKR.vETH" },
    { "currencyid": "i9nwxtKuVYX4MSbeULLiK2ttVi6rUEhh4X", "ticker": "vETH" },
    { "currencyid": "iS8TfRPfVpKo5FVfSUzfHBQxo9KuzpnqLU", "ticker": "tBTC" },
    { "currencyid": "iExBJfZYK7KREDpuhj6PzZBzqMAKaFg7d2", "ticker": "vARRR" },
    { "currencyid": "i3f7tSctFkiPpiedY8QR5Tep9p4qDVebDx", "ticker": "Bridge.vETH" },
    { "currencyid": "i4Xr5TAMrDTD99H69EemhjDxJ4ktNskUtc", "ticker": "Switch" },
    { "currencyid": "i61cV2uicKSi1rSMQCBNQeSYC3UAi9GVzd", "ticker": "vUSDC.vETH" },
    { "currencyid": "iC5TQFrFXSYLQGkiZ8FYmZHFJzaRF5CYgE", "ticker": "EURC.vETH" },
    { "currencyid": "iHax5qYQGbcMGqJKKrPorpzUBX2oFFXGnY", "ticker": "Pure" },
    { "currencyid": "i9kVWKU2VwARALpbXn4RS9zvrhvNRaUibb", "ticker": "Kaiju"},
    { "currencyid": "i9oCSqKALwJtcv49xUKS2U2i79h1kX6NEY", "ticker": "vUSDT.vETH"},
    { "currencyid": "i6j1rzjgrDhSmUYiTtp21J8Msiudv5hgt9", "ticker": "Bridge.vDEX"},
    { "currencyid": "iHog9UCTrn95qpUBFCZ7kKz7qWdMA8MQ6N", "ticker": "vDEX"},
    { "currencyid": "iRt7tpLewArQnRddBVFARGKJStK6w5pDmC", "ticker": "NATI"},
    { "currencyid": "iL62spNN42Vqdxh8H5nrfNe8d6Amsnfkdx", "ticker": "NATI.vETH"},
    { "currencyid": "iD5WRg7jdQM1uuoVHsBCAEKfJCKGs1U3TB", "ticker": "Bridge.vARRR"},
    { "currencyid": "i9bBvuJijJeHcqFsDzAwW7f5wTBThULuhX", "ticker": "cybermoney"},
    { "currencyid": "i7ekXxHYzXW7uAfu5BtWZhd1MjXcWU5Rn3", "ticker": "bitcoins"},
    { "currencyid": "iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw", "ticker": "NATI.Owl"},
    { "currencyid": "i6SapneNdvpkrLPgqPhDVim7Ljek3h2UQZ", "ticker": "SUPERNET"},
    { "currencyid": "iHnYAmrS45Hb8GVgyzy7nVQtZ5vttJ9N3X", "ticker": "SUPERVRSC"}
]

const routes = [
  { path: '/', component: Home },
  { path: '/bridge-veth', component: VerusBasketView, props: {fullyQualifiedName: 'Bridge.vETH', currencyDictionary: currencyDictionary}},
  { path: '/pure', component: VerusBasketView, props: {fullyQualifiedName: 'Pure', currencyDictionary: currencyDictionary}},
  { path: '/nati-owl', component: VerusBasketView, props: {fullyQualifiedName: 'iH37kRsdfoHtHK5TottP1Yfq8hBSHz9btw', currencyDictionary: currencyDictionary}},
  { path: '/supervrsc', component: VerusBasketView, props: {fullyQualifiedName: 'SUPERVRSC', currencyDictionary: currencyDictionary}}
]

const router = createRouter({
    mode: 'history',
    history: createWebHistory(),
    routes,
})

export default router;