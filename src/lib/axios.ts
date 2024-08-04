import axios from 'axios'

export const api = axios.create({
    baseURL: 'https://apis.codante.io/olympic-games'
})