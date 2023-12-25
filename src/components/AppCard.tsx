import {
  Card,
  Link,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";

interface Prop {
  title: string;
  desc: string;
  path: string;
  // onClick?: () => {};
}

// const BootstrapButton = styled(Button)({
//   boxShadow: 'none',
//   textTransform: 'none',
//   fontSize: 16,
//   padding: '6px 12px',
//   border: '1px solid',
//   lineHeight: 1.5,
//   backgroundColor: '#0063cc',
//   borderColor: '#0063cc',
//   fontFamily: [
//     '-apple-system',
//     'BlinkMacSystemFont',
//     '"Segoe UI"',
//     'Roboto',
//     '"Helvetica Neue"',
//     'Arial',
//     'sans-serif',
//     '"Apple Color Emoji"',
//     '"Segoe UI Emoji"',
//     '"Segoe UI Symbol"',
//   ].join(','),
//   '&:hover': {
//     backgroundColor: '#0069d9',
//     borderColor: '#0062cc',
//     boxShadow: 'none',
//   },
//   '&:active': {
//     boxShadow: 'none',
//     backgroundColor: '#0062cc',
//     borderColor: '#005cbf',
//   },
//   '&:focus': {
//     boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)',
//   },
// });

const AppCard = (prop: Prop) => {
  return (
    <Link href={prop.path} underline="none">
      <Card variant="outlined">
        <CardActionArea>
          <CardContent>
            <Typography variant="h5" component="div" sx={{ color: "#202124" }}>
              {prop.title}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{ color: "#5f6368" }}
            >
              {prop.desc}
            </Typography>
          </CardContent>
          {/* <CardActions>
            <Link href={prop.path}>
              <Button size="small">
                <ArrowRightAltOutlinedIcon />
              </Button>
            </Link>
          </CardActions> */}
        </CardActionArea>
      </Card>
    </Link>
  );
};

export default AppCard;
