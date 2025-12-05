import Session from "../models/sessionModel.js";
import Transaction from "../models/transactionModel.js";
import axios from "axios";
const { CHAPA_KEY, CHAPA_API_WEB } = process.env;

export const deposit = async (req, res, next) => {
  try {
    const { token, type, meta } = req.body;

    let amount = 100
    let callback_url = "https://tinder-addis.netlify.app/"

    if(type === 'quiz') {
      amount = 25
      callback_url = "https://iq2025.netlify.app/"
    }
    else if(type === 'horoscope') {
      amount = 25
    }
    else if(type === 'lookup') {
      amount = 75
    }
    else if(type === 'bonus') {
      amount = 25
    }




    // Validate required fields
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    if (!type) {
      return res.status(400).json({ message: "Type is required" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    // Find the session linked to the token
    const session = await Session.findOne({ token });

    if (!session) {
      return res.status(400).json({ message: "Invalid session token" });
    }

    // Create transaction
    const transaction = await Transaction.create({
      session: session._id,
      amount,
      type,
      status: "pending",
      meta: meta || {},
    });


    const txRef = transaction._id.toString();
    const amountWithVat = (amount / (1 - 2.5 / 100)).toFixed(2);

      const response = await axios.post(
        CHAPA_API_WEB,
        {
          amount: amountWithVat,
          currency: "ETB",
          email: `quizbot@gmail.com`,
          tx_ref: txRef,
          callback_url: callback_url,
          return_url: callback_url,
          "customization[title]": "Web Payment",
          "customization[description]": "Access premium features",
        },
        {
          headers: {
            Authorization: `Bearer ${CHAPA_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (
        response.data &&
        response.data.status === "success" &&
        response.data.data.checkout_url
      ) {
        return res.status(200).json({
          message: "Please complete the payment using the link.",
          checkoutUrl: response.data.data.checkout_url,
          txRef
        });
      } else {
        return res.status(500).json({
          message: "Failed to initialize bank payment. Please try again.",
        });
      }


  } catch (err) {
    console.error("Deposit error:", err);
    next(err);
  }
};




export const check = async (req, res, next) => {
  try {
    const { token, tr } = req.body;

    // Validate token
    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    // Validate transaction id
    if (!tr) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Validate session
    const session = await Session.findOne({ token });
    if (!session) {
      return res.status(400).json({ message: "Invalid session token" });
    }

    // Validate transaction belongs to this session
    const transaction = await Transaction.findOne({
      _id: tr,
      session: session._id,
    });

    if (!transaction || transaction.status !== 'success') {
      return res.status(400).json({ message: "Invalid transaction" });
    }

    return res.status(200).json({
      message: "Success",
      transaction: transaction.status
    });
  } catch (err) {
    console.error("Check error:", err);
    next(err);
  }
};


