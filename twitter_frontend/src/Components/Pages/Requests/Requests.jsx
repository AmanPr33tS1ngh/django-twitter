import axios from "../../Redux/Axios/axios";
import React, { useEffect, useState } from "react";
import Loader from "../../ReUsableComponents/Loader/Loader";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRequests();
  }, []);
  const getRequests = () => {
    const endpoint = "http://127.0.0.1:8000/users/get_requests/";
    setLoading(true);
    axios.post(endpoint).then((res) => {
      const responseData = res.data;
      setRequests(responseData.requests);
      setLoading(false);
    });
  };
  const requestApi = (id, type) => {
    const endpoint = "http://127.0.0.1:8000/users/request_api/";
    const data = {
      type: type,
      id: id,
    };
    axios.post(endpoint, data).then((res) => {
      const responseData = res.data;
      if (responseData.success) {
        const newRequests = requests.filter((request) => request.id !== id);
        setRequests(newRequests);
      }
    });
  };

  return (
    <div>
      <h1 className="text-xl font-semibold flex justify-between m-3">
        Requests
      </h1>
      <hr style={{ marginTop: "1rem", marginBottom: "1rem" }} />
      <div className="m-5">
        {loading ? (
          <Loader />
        ) : requests?.length ? (
          requests.map((request) => (
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className={"flex h-[30px] w-[30px] mr-2  rounded-full"}>
                  <img
                    alt={"img"}
                    className={"rounded-full"}
                    src={request.sender?.profile_picture}
                  />
                </div>
                <p>
                  <span className="font-semibold">
                    {request.sender?.username}
                  </span>{" "}
                  requested to follow you
                </p>
              </div>
              <div>
                <button
                  onClick={() => requestApi(request.id, "accept")}
                  className="is-boxed text-sm is-centered bg-blue-500 text-white py-1 px-3 rounded-lg button mr-1"
                >
                  Confirm
                </button>
                <button
                  onClick={() => requestApi(request.id, "delete")}
                  className="is-boxed text-sm is-centered bg-gray-200 py-1 px-3 rounded-lg button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="p-4 text-lg font-bold">No requests</p>
        )}
      </div>
    </div>
  );
};

export default Requests;
