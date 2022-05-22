'use strict';

module.exports = function(_){
    return {
        SetRouting: function(router){
            router.get('/', this.indexPage);
            router.get('/signup', this.getSignUP);
        },
        indexPage: function(request, response){
            return response.render('index');
        },

        getSignUP: function(request, response){
            return response.render('signup');
        }
    }
}