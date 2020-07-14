import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lookId:''
  },
  mutations: {
    saveLookId(state,id){
        state.lookId = id
    }
  },
  actions: {
  },
  modules: {
  }
})
