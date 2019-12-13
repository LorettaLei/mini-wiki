import axios from '../../axiosRequest'

export default {
    updateUser(data) {
        return axios({
            method: 'post',
            url: '/docs/user/update',
            data: data,
            transformRequest: [function(data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        })
    },
}