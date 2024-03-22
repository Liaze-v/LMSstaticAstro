
    const isLocal = document.location.host.split(':').shift() === 'localhost'
    const auth = new GoTrue({
        APIUrl: 'https://URL.netlify.app/.netlify/identity',
        setCookie: !isLocal
    });
    // Get the current user object, or null if no-ones logged in
    const user = auth.currentUser()
    
    const loginForm = document.querySelector('.identity-form-login')
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      auth
      .login(this.email.value, this.password.value, true)
      .then(user => {
        loginSucess()
        window.location.href = '/index.html'
      },
        error => console.error("Failed to log in: %o", error)
      )
    })
    const logoutButton = document.querySelector('#btn-Logout')
    logoutButton.addEventListener('click', function() {
        const user = auth.currentUser()
        if (!user) return
        user
        .logout()
        .then((response) => window.location.href = '/index.html',
        error => console.error("Failed to logout user: %o", error)
        );
    })
    const signupForm = document.querySelector('.identity-form-signup')
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
        if(!regex.test(this.email.value)) {
            alert(regex.test(this.email.value));
            return
        }
        if(this.password.value != this.password2.value) {
            alert("Passwords do not match");
            return
        }
        // console.log("this")
        auth
        .signup(this.email.value,this.password.value,{ full_name: this.name.value })
        .then(
            response => {
                console.log("Confirmation email sent")
                emailsend()
            },
            error => console.error("Error during signup: %o", error)
            );
            console.log("this")
    })
    const recoverForm = document.querySelector('.identity-form-forget')
    recoverForm.addEventListener('submit', function(event) {
        event.preventDefault();
        auth
        .requestPasswordRecovery(this.email.value)
        .then((response) => {
            console.log('Recovery email sent', { response })
            emailresetsend()
        })
        .catch((error) => console.log('Error sending recovery mail: %o', error));
    })
    if (window.location.hash && window.location.hash.indexOf('#confirmation_token=') === 0) {
        const token = window.location.hash.replace('#confirmation_token=', '')
        auth.confirm(token, true).then(
            user => window.location.href = '/formation.html',
            error => console.error("Failed to log in: %o", error)
        );
    }

    const btnlogin = document.getElementById('btn-login')
    const divlogin = document.getElementById('div-login')
    const btnSignup = document.getElementById('btn-Signup')
    const divSignup = document.getElementById('div-Signup')
    const divSignup2 = document.getElementById('div-Signup2')
    const divforget = document.getElementById('div-forget')
    const btnLogout = document.getElementById('btn-Logout')
    const btnAccount = document.getElementById('btn-Account')
    const btnFormation = document.getElementById('btn-formation')
    const btnFormationPro = document.getElementById('btn-formation-pro')
    if(user === null) {
        btnlogin.style.display = "block";
        btnSignup.style.display = "block";
        btnLogout.style.display = "none";
        btnAccount.style.display = "none";
        btnFormation.style.display = "block";
        btnFormationPro.style.display = "none";
    }else{
        btnLogout.style.display = "block";
        btnAccount.style.display = "block";
        btnlogin.style.display = "none";
        btnSignup.style.display = "none";
        btnFormation.style.display = "none";
        btnFormationPro.style.display = "block";
    }

    const registrationModal = document.getElementsByClassName('identity-registration')[0]
    const forgetModal = document.getElementsByClassName('identity-forget')[0]
    const loginModal = document.getElementsByClassName('identity-login')[0]
    const outerModal = document.getElementsByClassName('modal-outer')[0]
    btnlogin.addEventListener('click', login)
    divlogin.addEventListener('click', login)
    btnSignup.addEventListener('click', signup)
    divSignup.addEventListener('click', signup)
    divSignup2.addEventListener('click', signup)
    divforget.addEventListener('click', forget)



    function openmodal() {
        outerModal.style.display = "block";
        outerModal.style.opacity = "1";
        closemodal()
    }
    function closemodal() {
        window.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                outerModal.style.opacity = "0";
                outerModal.style.display = "none";
            }
        });
        outerModal.addEventListener('click', () =>{
            const isOutside = !event.target.closest('.modal-inner');
            if (isOutside) {
                outerModal.style.opacity = "0";
                outerModal.style.display = "none";
            }
        })
    }
    function login() {
        openmodal()
        registrationModal.style.display = "none";
        forgetModal.style.display = "none";
        loginModal.style.display = "block";
    }
    function signup() {
        openmodal()
        loginModal.style.display = "none";
        forgetModal.style.display = "none";
        registrationModal.style.display = "block";
    }
    function forget() {
        openmodal()
        registrationModal.style.display = "none";
        loginModal.style.display = "none";
        forgetModal.style.display = "block";
    }
    function emailsend() {
        openmodal()
        registrationModal.style.display = "none";
        document.getElementsByClassName('identity-emailsend')[0].style.display = "block";
    }
    function emailresetsend() {
        openmodal()
        forgetModal.style.display = "none";
        document.getElementsByClassName('identity-emailresetsend')[0].style.display = "block";
    }
    function emailconfirm() {
        openmodal()
        document.getElementsByClassName('identity-emailconfirm')[0].style.display = "block";
    }
    function loginSucess() {
        openmodal()
        loginModal.style.display = "none";
        document.getElementsByClassName('identity-loginSucess')[0].style.display = "block";
    }
    // if(user === null) {
    // }
    if (user) {
    
    
    document.querySelectorAll('.checkoutbtnPro').forEach(item => {
        item.innerHTML = "Checkout";
        item.addEventListener('click', () => {
            fetch('/.netlify/functions/stripecheckout', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${user.token.access_token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  item:[{id:"automa"}]
                })
              })
                .then((res) => res.json())
                .then((link) => { 
                  window.location.href = link;
                })
                .catch((err) => console.error(err));
        });
      });
    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
    const user_data = JSON.stringify({userRoles: user.app_metadata.roles, userEmail: user.email, userId: user.id, userMetadata: user.user_metadata})
    setCookie('user_data', user_data, 1);
    }else{
        document.querySelectorAll('.checkoutbtnPro').forEach(item => {
            item.addEventListener('click', function(event) {
                login()
            })
          });
    }


document.addEventListener('astro:beforeload', () => {
    // This only runs once.
    const isLocal = document.location.host.split(':').shift() === 'localhost'
    const auth = new GoTrue({
        APIUrl: 'https://URL.netlify.app/.netlify/identity',
        setCookie: !isLocal
    });
    // Get the current user object, or null if no-ones logged in
    const user = auth.currentUser()
    
    const loginForm = document.querySelector('.identity-form-login')
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      auth
      .login(this.email.value, this.password.value, true)
      .then(user => {
        loginSucess()
        window.location.href = '/index.html'
      },
        error => console.error("Failed to log in: %o", error)
      )
    })
    const logoutButton = document.querySelector('#btn-Logout')
    logoutButton.addEventListener('click', function() {
        const user = auth.currentUser()
        if (!user) return
        user
        .logout()
        .then((response) => window.location.href = '/index.html',
        error => console.error("Failed to logout user: %o", error)
        );
    })

    const signupForm = document.querySelector('.identity-form-signup')
    signupForm.addEventListener('submit', function(event) {
        event.preventDefault();
        let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
        if(!regex.test(this.email.value)) {
            alert(regex.test(this.email.value));
            return
        }
        if(this.password.value != this.password2.value) {
            alert("Passwords do not match");
            return
        }
        auth
        .signup(this.email.value,this.password.value,{ full_name: this.name.value })
        .then(
            response => {
                console.log("Confirmation email sent")
                emailsend()
            },
            error => console.error("Error during signup: %o", error)
            );
            console.log("this")
    })
    const recoverForm = document.querySelector('.identity-form-forget')
    recoverForm.addEventListener('submit', function(event) {
        event.preventDefault();
        auth
        .requestPasswordRecovery(this.email.value)
        .then((response) => {
            console.log('Recovery email sent', { response })
            emailresetsend()
        })
        .catch((error) => console.log('Error sending recovery mail: %o', error));
    })
    if (window.location.hash && window.location.hash.indexOf('#confirmation_token=') === 0) {
        const token = window.location.hash.replace('#confirmation_token=', '')
        auth.confirm(token, true).then(
            user => window.location.href = '/formation.html',
            error => console.error("Failed to log in: %o", error)
        );
    }

    const btnlogin = document.getElementById('btn-login')
    const divlogin = document.getElementById('div-login')
    const btnSignup = document.getElementById('btn-Signup')
    const divSignup = document.getElementById('div-Signup')
    const divSignup2 = document.getElementById('div-Signup2')
    const divforget = document.getElementById('div-forget')
    const btnLogout = document.getElementById('btn-Logout')
    const btnAccount = document.getElementById('btn-Account')
    const btnFormation = document.getElementById('btn-formation')
    const btnFormationPro = document.getElementById('btn-formation-pro')

    if(user === null) {
        btnlogin.style.display = "block";
        btnSignup.style.display = "block";
        btnLogout.style.display = "none";
        btnAccount.style.display = "none";
        btnFormation.style.display = "block";
        btnFormationPro.style.display = "none";
    }else{
        btnLogout.style.display = "block";
        btnAccount.style.display = "block";
        btnlogin.style.display = "none";
        btnSignup.style.display = "none";
        btnFormation.style.display = "none";
        btnFormationPro.style.display = "block";
    }

    const registrationModal = document.getElementsByClassName('identity-registration')[0]
    const forgetModal = document.getElementsByClassName('identity-forget')[0]
    const loginModal = document.getElementsByClassName('identity-login')[0]
    const outerModal = document.getElementsByClassName('modal-outer')[0]
    btnlogin.addEventListener('click', login)
    divlogin.addEventListener('click', login)
    btnSignup.addEventListener('click', signup)
    divSignup.addEventListener('click', signup)
    divSignup2.addEventListener('click', signup)
    divforget.addEventListener('click', forget)



    function openmodal() {
        outerModal.style.display = "block";
        outerModal.style.opacity = "1";
        closemodal()
    }
    function closemodal() {
        window.addEventListener('keydown', event => {
            if (event.key === 'Escape') {
                outerModal.style.opacity = "0";
                outerModal.style.display = "none";
            }
        });
        outerModal.addEventListener('click', () =>{
            const isOutside = !event.target.closest('.modal-inner');
            if (isOutside) {
                outerModal.style.opacity = "0";
                outerModal.style.display = "none";
            }
        })
    }
    function login() {
        openmodal()
        registrationModal.style.display = "none";
        forgetModal.style.display = "none";
        loginModal.style.display = "block";
    }
    function signup() {
        openmodal()
        loginModal.style.display = "none";
        forgetModal.style.display = "none";
        registrationModal.style.display = "block";
    }
    function forget() {
        openmodal()
        registrationModal.style.display = "none";
        loginModal.style.display = "none";
        forgetModal.style.display = "block";
    }
    function emailsend() {
        openmodal()
        registrationModal.style.display = "none";
        document.getElementsByClassName('identity-emailsend')[0].style.display = "block";
    }
    function emailresetsend() {
        openmodal()
        forgetModal.style.display = "none";
        document.getElementsByClassName('identity-emailresetsend')[0].style.display = "block";
    }
    function emailconfirm() {
        openmodal()
        document.getElementsByClassName('identity-emailconfirm')[0].style.display = "block";
    }
    function loginSucess() {
        openmodal()
        loginModal.style.display = "none";
        document.getElementsByClassName('identity-loginSucess')[0].style.display = "block";
    }

    if (user) {
    
    
    document.querySelectorAll('.checkoutbtnPro').forEach(item => {
        item.innerHTML = "Checkout";
        item.addEventListener('click', () => {
            fetch('/.netlify/functions/stripecheckout', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${user.token.access_token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  item:[{id:"automa"}]
                })
              })
                .then((res) => res.json())
                .then((link) => { 
                  window.location.href = link;
                })
                .catch((err) => console.error(err));
        });
      });

    function setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        let expires = "expires="+ d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
    const user_data = JSON.stringify({userRoles: user.app_metadata.roles, userEmail: user.email, userId: user.id, userMetadata: user.user_metadata})
    setCookie('user_data', user_data, 1);
    }else{
        document.querySelectorAll('.checkoutbtnPro').forEach(item => {
            item.addEventListener('click', function(event) {
                login()
            })
          });
    }
}, { once: false });