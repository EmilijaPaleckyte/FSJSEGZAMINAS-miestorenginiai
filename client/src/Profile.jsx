import PropTypes from "prop-types";
import pfp from "./assets/pfp.png";

const Profile = ({ user, handleLogout }) => {
  if (!user) {
    return null;
  }

  return (
    <div
      style={{
        background: "#f0f0f0",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <div
              className="card text-center"
              style={{
                padding: "20px",
                margin: "auto",
              }}
            >
              <div className="card-body">
                <img
                  src={pfp}
                  alt="User Profile"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    marginBottom: "15px",
                  }}
                />
                <h2 style={{ color: "black", marginBottom: "10px" }}>
                  {user.email}
                </h2>
                <p>Email: {user.email}</p>
                <button className="btn btn-primary mt-3" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
  }),
  handleLogout: PropTypes.func.isRequired,
};

export default Profile;
