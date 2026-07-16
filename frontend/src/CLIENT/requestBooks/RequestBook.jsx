import axios from "axios";
import { backend_server } from "../../main";
import { useLoginState } from "../../LoginState";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RequestBook = () => {
  const Request_API_URL = `${backend_server}/api/v1/requestBooks`;

  const navigate = useNavigate();
  const { userLogState, addRequestedBookId, promptPassword } = useLoginState();

  const request_Book = async (book_id) => {
    if (userLogState === null) {
      console.log("Not Logged in ");
      toast(`Please 'Login' to request for books`, {
        icon: "ℹ️",
      });
      navigate("/login", { replace: true });
    } else {
      // 1. Custom UI Password Prompt
      const isVerified = await promptPassword();
      if (!isVerified) return; // User cancelled or closed the modal

      try {
        // If verified, proceed with making the borrow request
        const response = await axios.post(Request_API_URL, {
          bookId: book_id,
        });
        toast.success("Book Requested successfully");
        addRequestedBookId(book_id); // Update local requested state
      } catch (error) {
        console.log(error.response);
        const message = error.response?.data?.message || "Failed to process request";
        toast.error(message);
      }
    }
  };
  return { request_Book };
};

export default RequestBook;
