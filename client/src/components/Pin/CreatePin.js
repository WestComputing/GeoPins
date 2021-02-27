import React, { useState, useContext } from "react";
import axios from 'axios';

import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";

import Context from "../../context";
import {useClient} from "../../client";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";

const CreatePin = ({ classes }) => {
  const client = useClient();
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "west221b");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/west221b/image/upload",
      data
    );
    return res.data.url;
  };

  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT" });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const url = image
        ? await handleImageUpload()
        : "https://askleo.askleomedia.com/wp-content/uploads/2004/06/no_image-300x245.jpg";
      const { latitude, longitude } = state.draft;
      const variables = { title, image: url, content, latitude, longitude };
      await client.request(CREATE_PIN_MUTATION, variables);
      handleDeleteDraft();
    } catch (error) {
      console.error("Error creating pin:", error);
      setSubmitting(false);
    }
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component="h2"
        variant="h4"
        color="secondary"
      >
        <LandscapeIcon className={classes.iconLarge}/> Pin Location
      </Typography>
      <div>
        <TextField
          name="title"
          label="Title"
          placeholder="Enter pin title"
          onChange={event => setTitle(event.target.value)}
        />
        <input
          className={classes.input}
          accept="image/*"
          id="image"
          type="file"
          onChange={event => setImage(event.target.files[0])}
        />
        <label htmlFor="image">
          <Button
            className={classes.button}
            component="span"
            size="small"
            style={{ color: image && "green" }}
          >
            <AddAPhotoIcon/>
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name="content"
          label="Content"
          multiline
          rows="6"
          margin="normal"
          fullWidth
          variant="outlined"
          onChange={event => setContent(event.target.value)}
        />
      </div>
      <div>
        <Button
          className={classes.button}
          variant="contained"
          color="primary"
          onClick={handleDeleteDraft}
        >
          <ClearIcon className={classes.leftIcon}/>
          Discard
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          type="submit"
          disabled={!title.trim() || submitting}
          onClick={handleSubmit}
        >
          Submit
          <SaveIcon className={classes.rightIcon}/>
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
