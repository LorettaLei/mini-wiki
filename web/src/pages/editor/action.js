import axios from '../../axiosRequest'

export default {
    createMD(data) {
        return axios({
            method: 'post',
            url: `/docs/md/create`,
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