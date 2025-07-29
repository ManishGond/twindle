import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15*60*1000, // 15minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many attempts, Please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false
})

export default authLimiter