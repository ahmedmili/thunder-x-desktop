import { Box, Container, Typography } from "@mui/material";
import { useAppSelector } from "../../Redux/store";
import "./profile.page.css";

const ProfilePage = () => {
  const user = useAppSelector((state) => state.user.user);

  return (
    <Container maxWidth="lg">
      <div className="div-container">
        <Typography
          variant="h2"
          component="h1"
          sx={{ color: "#1f1e1e", fontWeight: 500 }}
        >
          Profile Page
        </Typography>
      </div>
      <Box sx={{ mt: 2 }}>
        <Typography gutterBottom>
          <strong>Id:</strong> {user?._id}
        </Typography>
        <Typography gutterBottom>
          <strong>Full Name:</strong> {user?.name}
        </Typography>
        <Typography gutterBottom>
          <strong>Email Address:</strong> {user?.email}
        </Typography>
        <Typography gutterBottom>
          <strong>Role:</strong> {user?.role}
        </Typography>
      </Box>
    </Container>
  );
};

export default ProfilePage;
