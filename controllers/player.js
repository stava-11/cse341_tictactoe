exports.getProfile = (req, res, next) => {
    // if (!req.session.isLoggedIn){
    //     return res.redirect('login')
    // }
    res.render('editUserProfile' , { 
        pageTitle: 'Edit Profile', 
        path: '/editUserProfile' 
    });
};
exports.getDashboard = (req, res, next) => {
    res.render('dashboard', { 
        pageTitle: 'Dashboard', 
        path: '/dashboard' 
    });
};
exports.getPlayGame = (req, res, next) => {
    res.render('playGame', { 
        pageTitle: 'Play Game', 
        path: '/playGame' 
    });
};

