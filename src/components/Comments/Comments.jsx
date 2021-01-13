import React from "react";
import { Button, Container, Row, Col, Image } from "react-bootstrap";
import "./styles.scss";

class Comments extends React.Component {
  state = {
    showComments: false,
    reviews: [],
  };

  componentDidMount = () => {
    this.fetchReviews();
  };

  fetchReviews = async () => {
    try {
      let response = await fetch(
        "http://localhost:9001/articles/" + this.props.id + "/reviews"
      );
      let reviewsArray = await response.json();
      this.setState({ reviews: reviewsArray });
    } catch (error) {
      console.log(error);
    }
  };

  postReview = async (e) => {
    e.preventDefault();
    try {
      let text = document.querySelector("#commentForReview").value;
      let body = {
        text: text,
        user: "Not_Abdul",
      };
      let response = await fetch(
        "http://localhost:9001/articles/" + this.props.id,
        {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      document.querySelector("#commentForReview").value = "";
      this.fetchReviews();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  calculateTimeDiff = (current, updated) => {
    let currentTime = new Date();
    let postDate = new Date(current);
    let currentMilli = currentTime.getTime();
    let postMilli = postDate.getTime();
    let diffMilli = currentMilli - postMilli;
    let diffMins = Math.ceil(diffMilli / 60000);
    if (diffMins >= 60) {
      let timeDiff = Math.floor(diffMins / 60).toString() + "h";

      if (current === updated) {
        return timeDiff;
      } else {
        return timeDiff + "• Edited";
      }
    } else {
      let timeDiff = diffMins.toString() + "m";

      if (current === updated) {
        return timeDiff;
      } else {
        return timeDiff + "• Edited";
      }
    }
  };

  render() {
    return (
      <>
        <span
          className="responses"
          style={{ fontSize: 12, marginLeft: "0.5em" }}
          onClick={() =>
            this.state.showComments
              ? this.setState({ showComments: false })
              : this.setState({ showComments: true })
          }
        >
          {this.state.reviews.length > 0
            ? this.state.reviews.length + " "
            : "No "}
          Responses
        </span>
        <div
          id="reviewsColumn"
          className={this.state.showComments ? "d-flex" : "d-none"}
        >
          <div
            className="commentBox d-flex flex-column"
            style={{ marginTop: 50, marginBottom: 50 }}
          >
            <label>What are your thoughts?</label>
            <textarea
              id="commentForReview"
              placeholder="What are your thoughts?"
            />
            <Button variant="success" onClick={(e) => this.postReview(e)}>
              Send
            </Button>
          </div>
          <div className="commentsHolder d-flex flex-column">
            {this.state.reviews.length > 0 &&
              this.state.reviews.map((review) => (
                <div className="singleComment">
                  <div className="postInfo">
                    <div>
                      <Image
                        style={{ width: 50, height: 50, marginRight: 15 }}
                        src="https://steamuserimages-a.akamaihd.net/ugc/85970797296227631/C8871AB3E0353D6E02A39577ADF574149B11B3E8/"
                        roundedCircle
                      />
                    </div>
                    <div>
                      {review.user}
                      <p>
                        {this.calculateTimeDiff(
                          review.createdAt,
                          review.updatedAt
                        )}{" "}
                        ago
                      </p>
                    </div>
                  </div>
                  <div className="postBody">{review.text}</div>
                </div>
              ))}
          </div>
        </div>
      </>
    );
  }
}

export default Comments;
