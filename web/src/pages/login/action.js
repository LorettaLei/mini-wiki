import axios from '../../axiosRequest'

export default {
    login(data) {
        return axios({
            method: 'post',
            url: `/docs/user/login`,
            data: data,
            transformRequest: [function(data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }]
        })
    }
}