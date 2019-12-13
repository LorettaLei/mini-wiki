import axios from '../../axiosRequest'

export default {
    setMenu(data) {
        return axios({
            method: 'post',
            url: '/docs/md/menu/update',
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