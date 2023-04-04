import { Component, createRef } from "react";

const getRandom = (start, end) => {
  const re = ((Math.random() * (end - start)) | 0) + start;
  if (re === 0) {
    return getRandom(start, end);
  } else {
    return re;
  }
};

export class CanvasBG extends Component {
  ref = createRef();

  state = {
    nodes: [],
  };

  id = null;

  componentDidMount() {
    this.initialDots();
  }

  componentDidUpdate() {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => this.paint());
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.id);
  }

  initialDots() {
    const node = this.ref.current;

    const width = window.innerWidth;

    const height = window.innerHeight;

    node.width = width;

    node.height = height;

    const nodes = [];

    for (let i = 0; i < 400; i++) {
      const r = 1;
      const x = getRandom(0, width);
      const y = getRandom(0, height);
      const x_plus = getRandom(-2, 2);
      const y_plus = getRandom(-2, 2);
      nodes.push({ r, x, y, x_plus, y_plus });
    }

    this.setState({ nodes });
  }

  paint() {
    const node = this.ref.current;

    const width = node.width;

    const height = node.height;

    const { nodes } = this.state;

    const ctx = node.getContext("2d");

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "grey";

    nodes.forEach((n) => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, 2 * Math.PI);
      let nextX = n.x + n.x_plus * 0.5;
      let nextY = n.y + n.y_plus * 0.5;
      if (n.x > nextX && nextX <= 0) {
        n.x_plus = -n.x_plus;
      }
      if (n.x < nextX && nextX >= width) {
        n.x_plus = -n.x_plus;
      }
      if (n.y > nextY && nextY <= 0) {
        n.y_plus = -n.y_plus;
      }
      if (n.y < nextY && nextY >= height) {
        n.y_plus = -n.y_plus;
      }
      n.x = nextX;
      n.y = nextY;
      ctx.fill();
      ctx.closePath();
    });

    for (let i = 0; i < nodes.length - 1; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const instance = Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
        if (instance < 5000) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.closePath();
          ctx.lineWidth = "0.5";
          ctx.strokeStyle = `rgba(100, 100, 100, ${0.00021 * (5000 - instance)})`;
          ctx.stroke();
        }
      }
    }

    this.id = requestAnimationFrame(() => this.paint());
  }

  render() {
    return (
      <div style={{ position: "absolute", zIndex: "100", overflow: "hidden", width: "100%", height: "100%", pointerEvents: "none" }}>
        <canvas ref={this.ref} width="100vw" height="100vh" />
      </div>
    );
  }
}
