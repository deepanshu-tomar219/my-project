const User = require("../models/user.js");

module.exports.renderSigupForm = (req, res)=>{

       res.render("users/signup");
};

module.exports.addNewUser = async(req, res)=>{

       try{

       let {username, email, password} = req.body;

       let newUser = new User({

             username,
             email,
       });

       let registeredUser = await User.register(newUser, password);

       console.log(registeredUser);

       req.login(registeredUser,(err)=>{

              if(err){
                  return next(err);
              }
              
              req.flash("success", "Welcome To WanderLust!");

              res.redirect("/listings");
       });

       

    }catch(e){

        console.log(e);

        req.flash("error", e.message);
        res.redirect("/users/signup");
    }
};

module.exports.renderLoginForm = (req, res)=>{

       res.render("users/login");

};

module.exports.login = async(req, res)=>{

       req.flash("success", "Welcome To WanderLust");
       if(res.locals.redirectUrl){
          
              return res.redirect(res.locals.redirectUrl);
       }
       
       res.redirect("/listings");
};

module.exports.logout = (req, res, next)=>{

       req.logout((err)=>{

              if(err){
                  return next(err);
              }
              
              req.flash("success", "you are logged out!");
              res.redirect("/listings");
       });
};