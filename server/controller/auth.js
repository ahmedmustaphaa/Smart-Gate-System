import jwt from "jsonwebtoken";

export const LoginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { email },
        process.env.JWT_TOKEN,
        { expiresIn: "1d" }
      );

      return res.json({
        success: true,
        message: "login successful",
        token,
      });
    }

    return res.json({
      success: false,
      message: "invalid credentials",
    });

  } catch (error) {
   console.log(error)
  }
};