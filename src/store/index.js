import { createStore } from 'vuex'
import axios from 'axios'

export default createStore({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
    async getEmployeeInfo(){
      let data =await axios.get('http://localhost:9090/employee_information')
      console.log(data);
      
    }
  },
  modules: {
  }
})
