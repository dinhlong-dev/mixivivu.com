import axiosConfig from '../axiosConfig'

export const apiRegister = (payload) => new Promise(async(resovle, reject) => {
    try {
        const response = await axiosConfig({
            method: 'post',
            url: '/v1/auth/register',
            data: payload
        })
        resovle(response)

    } catch (error) {
        reject(error)
    }
})

export const apiLogin = (payload) => new Promise(async (resolve, reject) => {
    try {
        console.log('Sending Payload:', payload);
        const response = await axiosConfig({
            method: 'post',
            url: '/v1/auth/login',
            data: payload
        })
        console.log('Response data:', response.data);
        resolve(response)

    } catch (error) {
        console.error('Error:', error.response.data);
        reject(error)
    }
})