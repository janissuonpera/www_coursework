exports.is_registered = function(req, res, next){
  if(req.session.registered == true || req.session.admin == true){
    next();
  }else{
    res.status(401).send('Unauthorized');
  }
}

exports.is_admin = function(req, res, next){
  if(req.session.admin == true){
    next();
  }else{
    res.status(401).send('Unauthorized');
  }
}
