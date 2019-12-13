import axios from '../../axiosRequest'

export default {
    getMenu() {
        return axios({
            method: 'get',
            url: '/docs/md/menu'
        })
    },
    getMD(data) {
        return axios({
            method: 'get',
            url: `/docs/md/content`,
            params: data
        })
    },
    updateMD(data) {
        return axios({
            method: 'post',
            url: `/docs/md/update`,
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
    deleteMD(data) {
        return axios({
            method: 'post',
            url: `/docs/md/delete`,
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