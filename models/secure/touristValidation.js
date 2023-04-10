const Yup = require("yup");

exports.schema = Yup.object().shape({
  username: Yup.string()
    .required("نام کاربری الزامی می باشد")
    .matches(nameRegex, "Only English letters"),
});
