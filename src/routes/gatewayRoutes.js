import express from "express";
import axios from "axios";
import { SERVICES } from "../config/services.js";

const router = express.Router();

// const forwardRequest = async (req, res, targetUrl) => {
//   try {
//     const url = `${targetUrl}${req.url}`;
//     const method = req.method.toLowerCase();

//     const response = await axios({
//       method,
//       url,
//       data: req.body,
//       headers: req.headers,
//     });
//     if(req.url === '/:shortId' && response.status === 302) {
//       return res.redirect(response.headers.location);
//     }
//     res.status(response.status).json(response.data);
//   } catch (error) {
//     console.error("Gateway error:", error.message);
//     const status = error.response?.status || 500;
//     res.status(status).json({
//       success: false,
//       message: error.response?.data || "Internal Gateway Error",
//     });
//   }
// };


// const forwardRequest = async (req, res, targetUrl) => {
//   try {
//     const url = `${targetUrl}${req.url}`;
//     const method = req.method.toLowerCase();

//     // disable auto-following redirects
//     const response = await axios({
//       method,
//       url,
//       data: req.body,
//       headers: req.headers,
//       maxRedirects: 0,  
//       validateStatus: (status) => status < 400, // allow 3xx as valid
//     });

//     // handle redirect responses manually
//     if (response.status === 302 || response.status === 301) {
//       const location = response.headers.location;
//       console.log(`Redirecting client to: ${location}`);
//       return res.redirect(location);
//     }

//     // otherwise, return normal data
//     return res.status(response.status).json(response.data);
//   } catch (error) {
//     // if redirect-service manually returns a URL instead of 302
//     if (error.response && (error.response.status === 302 || error.response.status === 301)) {
//       const location = error.response.headers.location;
//       console.log(`Manual redirect: ${location}`);
//       return res.redirect(location);
//     }

//     console.error("Gateway error:", error.message);
//     const status = error.response?.status || 500;
//     return res.status(status).json({
//       success: false,
//       message: error.response?.data || "Internal Gateway Error",
//     });
//   }
// };




const forwardRequest = async (req, res, targetUrl, serviceName) => {
  try {
    const url = `${targetUrl}${req.url}`;
    const method = req.method.toLowerCase();

    const response = await axios({
      method,
      url,
      data: req.body,
      headers: req.headers,
      maxRedirects: 0, // don't follow automatically
      validateStatus: (status) => status < 400, // allow 3xx responses
    });

    // Handle redirects only for Redirect Service
    if (serviceName === "REDIRECT" && (response.status === 302 || response.status === 301)) {
      const location = response.headers.location;
      console.log(`Redirecting client to: ${location}`);
      return res.redirect(location);
    }

    // For other services, just return JSON
    return res.status(response.status).json(response.data);
  } catch (error) {
    // if redirect-service manually returns 302 via error.response
    if (
      serviceName === "REDIRECT" &&
      error.response &&
      (error.response.status === 302 || error.response.status === 301)
    ) {
      const location = error.response.headers.location;
      return res.redirect(location);
    }

    console.error(`[${serviceName}] Gateway error:`, error.message);
    const status = error.response?.status || 500;
    res.status(status).json({
      success: false,
      message: error.response?.data || "Internal Gateway Error",
    });
  }
};



// router.use("/api/v1/auth", (req, res) => forwardRequest(req, res, SERVICES.AUTH));
// router.use("/api/v1/url", (req, res) => forwardRequest(req, res, SERVICES.URL));
// router.use("/api/v1/redirect", (req, res) => forwardRequest(req, res, SERVICES.REDIRECT));


router.use("/api/v1/auth", (req, res) =>
  forwardRequest(req, res, SERVICES.AUTH, "AUTH")
);

router.use("/api/v1/url", (req, res) =>
  forwardRequest(req, res, SERVICES.URL, "URL")
);

router.use("/api/v1/redirect", (req, res) =>
  forwardRequest(req, res, SERVICES.REDIRECT, "REDIRECT")
);


export default router;
