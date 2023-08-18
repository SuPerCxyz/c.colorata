document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");

  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = loginForm.username.value;
    const password = loginForm.password.value;

    const requestData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const data = await response.json();
        const token = data.token;

        // Store the token in localStorage
        localStorage.setItem("token", token);
        window.location.href = "/";
      } else {
        loginMessage.textContent = "Invalid username or password.";
      }
    } catch (error) {
      console.error(error);
      loginMessage.textContent = "An error occurred.";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const loginMessage = document.getElementById("loginMessage");

  // ... 登录表单逻辑 ...

  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const registerUsername = registerForm.registerUsername.value;
    const registerPassword = registerForm.registerPassword.value;
    const email = registerForm.email.value;

    const registerData = {
      username: registerUsername,
      password: registerPassword,
      email: email,
    };

    try {
      const response = await fetch("/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registerData),
      });

      if (response.ok) {
        loginMessage.textContent =
          "Registration successful. You can now log in.";
      } else {
        loginMessage.textContent = "Registration failed. Please try again.";
      }
    } catch (error) {
      console.error(error);
      loginMessage.textContent = "An error occurred during registration.";
    }
  });
});
