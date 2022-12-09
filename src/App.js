// React and 3rd party
import { useState, useEffect, useCallback } from "react";
import Papa from "papaparse";

// Components

// Style
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Published Link
      const publishedURL =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vShibuhczu4WC0VODuWM-klS0Oog5P4YwVsbi0cA4MuJt7cpZpgSf24MAxpr7KQd6rU00BmzF_SYhJw/pub?gid=0&single=true&output=csv";
      Papa.parse(publishedURL, {
        download: true,
        header: true,
        complete: (results) => {
          const unsortedData = Array.from(results.data);
          const sortedData = unsortedData.sort((a, b) => {
            return b.score - a.score;
          });
          setData(sortedData);
        },
      });
    } catch (error) {
      console.error(error, "from fetchData");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e) => {
    setIsLoading(true);
    setSearch(e.target.value);
    // filter data
    const filtered = data.filter((item) => {
      return item.name.toLowerCase().includes(e.target.value.toLowerCase());
    });
    setFilteredData(filtered);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col space-y-2 items-center">
      <h1>SGSA Gr 7 Leader Board</h1>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={handleSearch}
      />
      <div className="flex flex-col space-y-4">
        {isLoading
          ? Array(5)
              .fill(0)
              .map((_, i) => <RowShimmer key={i} />)
          : (search ? filteredData : data).map(({ name, score }, i) => (
              <Row key={i} imgSrc={`${name}.png`} name={name} score={score} />
            ))}
      </div>
    </div>
  );
}

export default App;

const RowShimmer = () => (
  <div className="flex space-x-4">
    <div className="rounded-full w-15 h-15 animate-pulse bg-gray-500" />
    <div className="rounded h-8 w-20 bg-gray-500 animate-pulse" />
    <div className="rounded h-8 w-10 bg-gray-500 animate-pulse" />
  </div>
);

const Row = ({ imgSrc, name, score }) => (
  <div className="flex space-x-4 items-center">
    <img className="rounded-full w-15 h-15" src={imgSrc} alt={name} />
    <div className="flex space-x-4 items-center">
      <h3 className="font-semibold w-30">{name}</h3>
      <p className="text-sm text-gray-500">{score}</p>
    </div>
  </div>
);
