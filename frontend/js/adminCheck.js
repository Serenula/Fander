function checkAdmin() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.role === "superAdmin";
}
