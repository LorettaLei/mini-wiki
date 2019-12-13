import axios from '../../axiosRequest'

export default {
    getUser(data) {
        return axios({
            method: 'get',
            url: '/docs/log/list',
            params: data
        })
    },
}