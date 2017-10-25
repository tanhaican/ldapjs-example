var ldap = require('ldapjs');

var client = ldap.createClient({
	url: 'ldap://192.168.5.1:389' //LDAP服务地址
})

//创建LDAP查询选项
//filter的作用就是相当于SQL的条件
var opts = {
  filter: '(CN=名字)', //查询条件过滤器，查找CN=名字的用户节点
  scope: 'sub',        //查询范围
  timeLimit: 500       //查询超时
}
let user = 'name@domain.com' 
let pwd = 'password'
//将client绑定LDAP Server
//第一个参数：用户
//第二个参数：用户密码
client.bind(user, pwd, function (err, res1) {

    //开始查询
    //第一个参数：查询基础路径，代表在查询用户信心将在这个路径下进行，这个路径是由根节开始
    //第二个参数：查询选项
    client.search('DC=domain,DC=com', opts, function (err, res2) {

        //查询结果事件响应
        res2.on('searchEntry', function (entry) {
            console.log('***********************')
            //获取查询的对象
            var user = entry.object;
            var userText = JSON.stringify(user,null, 2);
            console.log(userText);
            
        });
        
        res2.on('searchReference', function(referral) {
            console.log('referral: ' + referral.uris.join());
        });    
        
        //查询错误事件
        res2.on('error', function(err) {
            console.error('error: ' + err.message);
            //unbind操作，必须要做
            client.unbind();
        });
        
        //查询结束
        res2.on('end', function(result) {
            console.log('search status: ' + result.status);
            //unbind操作，必须要做
            client.unbind();
        });        
        
    });
    
});
