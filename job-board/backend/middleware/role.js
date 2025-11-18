// backend/middleware/role.js
export default function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized: No user found in token" });
    }

    if (!req.user.role) {
      return res.status(403).json({ msg: "Forbidden: No role associated with this user" });
    }

    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({
        msg: `Forbidden: Requires role ${allowed.join(" or ")}, but you are '${req.user.role}'`
      });
    }

    next();
  };
}
