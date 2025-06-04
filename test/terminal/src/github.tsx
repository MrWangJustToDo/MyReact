import { Suspense, use, useEffect, useState } from "@my-react/react";
import { Box, render, Text } from "@my-react/react-terminal";

type ResponseType = { contributions: { date: string; count: number; level: number }[]; total: Record<string, number> };

const map = new Map<string, Promise<ResponseType>>();

const fetchWithCache = (user: string, year: string | number): Promise<ResponseType> => {
  const cacheKey = `github-${user}-${year}`;
  if (map.has(cacheKey)) {
    return map.get(cacheKey);
  }
  const promise = fetch(`https://github-contributions-api.jogruber.de/v4/${user}?y=${year}`).then((res) => res.json());
  map.set(cacheKey, promise);
  return promise;
};

const getMouthName = (mouth: number) => {
  switch (mouth) {
    case 1:
      return "Jan";
    case 2:
      return "Feb";
    case 3:
      return "Mar";
    case 4:
      return "Apr";
    case 5:
      return "May";
    case 6:
      return "Jun";
    case 7:
      return "Jul";
    case 8:
      return "Aug";
    case 9:
      return "Sep";
    case 10:
      return "Oct";
    case 11:
      return "Nov";
    case 12:
      return "Dec";
    default:
      return "";
  }
};

const getColorFromLevel = (commitsCount: number, isDarkTheme: boolean = true) => {
  if (commitsCount === 0) {
    return isDarkTheme ? "#161b22" : "#ebedf0"; // GitHub's empty cell colors
  }

  // Dynamic scaling based on actual commit count
  // Use logarithmic scale for better visual distribution
  const intensity = Math.min(Math.log(commitsCount + 1) / Math.log(20), 1);

  if (isDarkTheme) {
    // GitHub dark theme green color progression
    const baseR = 13; // #0d4429
    const baseG = 68;
    const baseB = 41;

    const maxR = 57; // #39d353
    const maxG = 211;
    const maxB = 83;

    const r = Math.round(baseR + (maxR - baseR) * intensity);
    const g = Math.round(baseG + (maxG - baseG) * intensity);
    const b = Math.round(baseB + (maxB - baseB) * intensity);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  } else {
    // GitHub light theme color progression
    const baseR = 235; // #ebedf0 (almost white)
    const baseG = 237;
    const baseB = 240;

    const maxR = 33; // #216e39 (dark green)
    const maxG = 110;
    const maxB = 57;

    // Reverse the intensity for light theme (darker = more commits)
    const r = Math.round(baseR + (maxR - baseR) * intensity);
    const g = Math.round(baseG + (maxG - baseG) * intensity);
    const b = Math.round(baseB + (maxB - baseB) * intensity);

    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  }
};

const group = (data: ResponseType) => {
  const headerWidth: Record<string, number> = {};

  const contributions = data.contributions.reduce<({ date: number; count: number; level: number }[] & { mouth?: string })[]>((acc, item) => {
    const date = new Date(item.date);
    const mouth = date.getMonth() + 1;
    const week = date.getDay();
    let next: (typeof acc)[number] = acc[acc.length - 1] || new Array(7).fill(undefined);
    if (week === 0) {
      next = new Array(7).fill(undefined);
    }
    const mouthName = getMouthName(mouth);
    next.mouth = mouthName;
    next[week] = {
      date: week,
      count: item.count,
      level: item.level,
    };
    if (acc.find((item) => item === next)) {
      return acc;
    }
    if (headerWidth[mouthName] === undefined) {
      headerWidth[mouthName] = 1;
    } else {
      headerWidth[mouthName] += 1;
    }
    acc.push(next);
    return acc;
  }, []);

  return { contributions, headerWidth };
};

const Column = () => {
  return (
    <Box flexDirection="column">
      <Text> </Text>
      <Text>Sun</Text>
      <Text>Mon</Text>
      <Text>Tue</Text>
      <Text>Wed</Text>
      <Text>Thu</Text>
      <Text>Fri</Text>
      <Text>Sat</Text>
    </Box>
  );
};

const Loading = () => {
  const [s, setS] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setS((prev) => (prev.length < 3 ? prev + "." : "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      <Text>Loading{s}</Text>
    </Box>
  );
};

const Github = ({ user, year }: { user: string; year: string | number }) => {
  const res = use(fetchWithCache(user, year)) as ResponseType;

  const { contributions: data, headerWidth } = group(res);

  let mouth = null;

  return (
    <Box borderColor="white" borderStyle="round" padding={1} flexDirection="column">
      <Box marginBottom={1}>
        <Text bold>{year} </Text>
        <Text>contributions</Text>
      </Box>
      <Box>
        <Column />
        <Box flexDirection="column" marginLeft={0.5}>
          <Box>
            {data.map((items, index) => {
              const currentMouth = items.mouth;
              const isNewMouth = mouth !== currentMouth;
              mouth = currentMouth;
              if (isNewMouth) {
                return (
                  <Box width={headerWidth[mouth] * 2} key={index}>
                    <Text key={index}>{mouth}</Text>
                  </Box>
                );
              }
              return null;
            })}
          </Box>
          <Box>
            {data.map((items, index) => {
              return (
                <Box flexDirection="column" key={index}>
                  {items.map((item, i) => {
                    if (!item) {
                      return <Text key={`${i}`}>{"  "}</Text>;
                    }
                    const color = getColorFromLevel(item.level);
                    return (
                      <Text key={`${i}`} backgroundColor={color}>
                        {"  "}
                      </Text>
                    );
                  })}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text>Total commits: {res.total[year]}</Text>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Github user="MrWangJustToDo" year={2025} />
    </Suspense>
  );
};

export const test = () => render(<App />);
