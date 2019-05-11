/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import React, { Component } from "react";
import { Song, isObjectEmpty, ws } from "../../Actions/index";
import { Avatar, Slider, Button } from "antd";
import { Dispatch } from "redux";
import { ReduxState } from "../../Stores";
import { connect } from "react-redux";
import { skipSong } from "../../Actions/websocket";
import styled from "@emotion/styled";
type MusicPlayerProps = {
  activeSong: Song;
};

function convertTime(time: number) {
  const seconds = Math.floor(time);
  const mins = Math.floor(seconds / 60);
  const secondsRemaining = seconds - mins * 60;

  // if seconds are less than 10 add 0 at the begining of the string so it looks like 0:01
  return `${mins}:${
    secondsRemaining < 10 ? `0${secondsRemaining}` : secondsRemaining
  }`;
}

const breakpoint = `@media (max-width: 576px)`;

const musicPlayer = css({
  background: "#282828",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end",
  width: "100%",
  marginLeft: "auto",
  marginRight: "auto",
  flexWrap: "wrap",
  padding: "1rem 5% 1rem 5%",
  height: "8rem"
  // [breakpoint]: {
  //   padding: "1rem 5% 1rem 5%"
  // }
});

const playerTools = css({
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-end"
});

const ButtonContainer = styled.div({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100%"
});

class MusicPlayer extends Component<MusicPlayerProps> {
  state = {
    progress: 0,
    clicked: false
  };

  render() {
    // const { duration_ms } = this.props.activeSong;
    const isSongSet = !isObjectEmpty(this.props.activeSong);
    return (
      <div css={musicPlayer}>
        {isSongSet && <ActiveSong activeSong={this.props.activeSong} />}
        <SkipSongButton />
      </div>
    );
  }
}

const SkipSongButton = () => (
  <ButtonContainer>
    <Button
      onClick={() => {
        skipSong();
      }}
    >
      SKIP SONG
    </Button>
  </ButtonContainer>
);

type SongTimerProps = {
  duration: number;
};

const songTimer = css({
  width: "30%",
  height: "80%"
});

class SongTimer extends Component<SongTimerProps> {
  state = {
    progress: 0
  };

  constructor(props: any) {
    super(props);
    setInterval(
      () => this.setState({ progress: this.state.progress + 1 }),
      1000
    );
  }

  componentWillReceiveProps(props: SongTimerProps) {
    if (props.duration !== this.props.duration) {
      this.setState({ progress: 0 });
    }
  }

  render() {
    const { duration } = this.props;
    return (
      <div css={songTimer}>
        <div>
          {convertTime(this.state.progress)} / {convertTime(duration)}
        </div>
      </div>
    );
  }
}

type ActiveSongProps = {
  activeSong: Song;
};

const activeSong = css({
  width: "70%",
  height: "80%",
  [breakpoint]: {
    width: "70%"
  }
});

class ActiveSong extends Component<ActiveSongProps> {
  render() {
    return (
      <div css={activeSong}>
        <Avatar
          size={50}
          shape={"square"}
          src={this.props.activeSong.thumbnail_url}
        />
        <div style={{ display: "inline-block", paddingLeft: "0.5rem" }}>
          <div style={{ fontSize: "0.9rem", width: "100%" }}>
            {this.props.activeSong.name}
          </div>
          <div style={{ fontSize: "0.7rem", width: "100%", color: "#b3b3b3" }}>
            {this.props.activeSong.artists}
          </div>
        </div>
      </div>
    );
  }
}

// Music player's dispatch to props and state to props
const mapStateToProps = (state: ReduxState) => {
  return {
    spotifySongs: state.spotifySongs,
    activeSong: state.activeSong
  };
};

export const MusicPlayerContainer = connect(mapStateToProps)(MusicPlayer);
