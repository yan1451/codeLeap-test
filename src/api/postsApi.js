import axios from 'axios'

const api = axios.create({
  baseURL: 'https://dev.codeleap.co.uk/',
})

function formatAxiosError(error) {
  if (error.response?.data) {
    return JSON.stringify(error.response.data)
  }
  return error.message || 'Request failed'
}

export async function getPosts(username = '') {
  try {
    const params = {}
    if (username.trim() !== '') {
      params.username = username.trim()
    }

    const { data } = await api.get('careers/', { params })
    return data.results ?? []
  } catch (error) {
    throw new Error(formatAxiosError(error))
  }
}

export async function createPost(payload) {
  try {
    const { data } = await api.post('careers/', payload)
    return data
  } catch (error) {
    throw new Error(formatAxiosError(error))
  }
}

export async function updatePost(id, payload) {
  try {
    const { data } = await api.patch(`careers/${id}/`, payload)
    return data
  } catch (error) {
    throw new Error(formatAxiosError(error))
  }
}

export async function deletePost(id) {
  try {
    await api.delete(`careers/${id}/`)
    return null
  } catch (error) {
    throw new Error(formatAxiosError(error))
  }
}
