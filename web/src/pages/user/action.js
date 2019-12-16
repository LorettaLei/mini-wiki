import axios from '../../axiosRequest'

export default {
    addUser(data) {
        return axios({
            method: 'post',
            url: '/docs/user/create',
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
    getUser(data) {
        return axios({
            method: 'get',
            url: '/docs/user/list',
            params: data
        })
    },
    delUser(data) {
        return axios({
            method: 'post',
            url: '/docs/user/delete',
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