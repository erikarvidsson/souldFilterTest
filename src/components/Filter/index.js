import React, { useState, useEffect } from "react";
import styled from "styled-components";

const ListItems = styled.div`
  .filter {
    display: flex;

    h4:nth-child(1) {
      border: none;
    }
    h4 {
      border: 1px solid #119;
      border-radius: 20px;
      cursor: pointer;
      &.active {
        border: 3px solid #114;
      }
    }
  }
  .listHeader {
    display: flex;

    h4 {
      border: 1px solid #000;
    }
  }
  .menu {
    border: 1px solid #119;
    &:hover .items {
      display: block;
    }
    h4 {
      width: 150px;
      &:after {
        content: " ▾";
      }
    }
    .items {
      display: none;

      h4 {
        width: fit-content;
        border: none;
        &:after {
          content: "";
        }
      }
    }
  }

  h4 {
    width: 15%;
    padding-left: 10px;
    height: max-content;
  }
  ul {
    list-style-type: none;
    padding-inline-start: 0;
  }
  li {
    display: flex;
  }
`;

const Filter = () => {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [tags] = useState(["tempor", "consequat", "adipisicing"]);
  const [sortedBy, setSortedBy] = useState();
  const [order, setOrder] = useState("asc");
  const [zipNumb, setZipNumb] = useState();
  const dataUrl = "https://api.dev.sould.se/";

  const getData = (sortedBy) =>
    fetch(`${dataUrl}${sortedBy ? sortedBy + order : ""}`).then((res) =>
      res.json()
    );

  useEffect(() => {
    if (!zipNumb) {
      getData(sortedBy).then((value) => setData(value));
    } else {
      sortByZipCode(order);
    }
  }, [sortedBy, order]);

  useEffect(() => {
    setFilteredData(data);
    // getAllTags();
  }, [data]);

  // const getAllTags = () => {
  //   setZipNumb(false);
  //   let dataTags = [];
  //   if (data) {
  //     data.map((pers) => {
  //       dataTags.push(pers.tags[0]);
  //     });

  //     const allTags = [...new Set(dataTags)];

  //     setTags(allTags);
  //   }
  // };

  const filterBySort = (sort) => {
    setZipNumb(false);
    setSortedBy(sort);
  };

  const filterByStatus = (value) => {
    setZipNumb(false);
    setFilteredData(data);
    value = value === "true" ? true : value === "false" ? false : "All";

    if (value === true || value === false) {
      let activeData = data.filter((obj) => {
        return obj.isActive === value;
      });

      setFilteredData(activeData);
    }
  };

  const filterByTags = (tag) => {
    setZipNumb(false);
    let activeData = data.map((pers) => {
      if (pers.tags.includes(tag)) {
        return pers;
      }
    });

    activeData = activeData.filter(function (notEmpty) {
      return notEmpty != null;
    });

    setFilteredData(activeData);
  };

  const sortByZipCode = (order) => {
    setZipNumb(true);
    setSortedBy(null);

    const orderData = (a, b) => {
      const adressA = a.address.split(",");
      const adressB = b.address.split(",");
      const numb = order === "desc" ? -1 : 1;

      return (adressA[adressA.length - 1] - adressB[adressA.length - 1]) * numb;
    };

    setFilteredData([...data.sort(orderData)]);
  };

  return (
    <ListItems>
      <div className="filter">
        <h4>Sotera efter:</h4>
        <h4 onClick={() => filterBySort(`?order_by=firstname&order=`)}>
          Förnamn
        </h4>
        <h4 onClick={() => filterBySort(`?order_by=surname&order=`)}>
          Efternamn
        </h4>
        <h4 onClick={() => filterBySort(`?order_by=age&order=`)}>Ålder</h4>

        <h4 onClick={() => sortByZipCode(order)}>Postnummer</h4>
        <h4>
          Order{" "}
          <select
            onChange={(e) => {
              setOrder(e.target.value);
            }}
          >
            <option value="" disabled selected hidden>
              Choose order
            </option>
            <option value={"asc"}>Asc</option>
            <option value={"desc"}>Desc</option>
          </select>
        </h4>
      </div>
      <div className="filter">
        <h4>Filtrera efter:</h4>

        <div className="menu">
          <h4>Select tag</h4>
          <div className="items">
            {tags &&
              tags.map((tag) => {
                return (
                  <>
                    <h4 onClick={(e) => filterByTags(e.target.innerHTML)}>
                      {tag}
                    </h4>
                  </>
                );
              })}
          </div>
        </div>

        <div className="menu">
          <h4>Select status</h4>
          <div className="items">
            <h4
              onClick={(e) => filterByStatus(e.target.innerHTML)}
              value={"all"}
            >
              All
            </h4>
            <h4 onClick={(e) => filterByStatus("true")} value={true}>
              Active
            </h4>
            <h4 onClick={(e) => filterByStatus("false")} value={false}>
              Not Active
            </h4>
          </div>
        </div>
      </div>
      <div className="listHeader">
        <h4>Förnamn</h4>
        <h4>Efternamn</h4>
        <h4>Ålder</h4>
        <h4>Adress</h4>
        <h4>Taggar</h4>
        <h4>Status</h4>
      </div>
      <ul>
        {filteredData &&
          filteredData.map((person) => {
            return (
              <>
                <li>
                  <h4>{person.firstname}</h4>
                  <h4>{person.surname}</h4>
                  <h4>{person.age}</h4>
                  <h4>{person.address}</h4>
                  <h4>
                    {person.tags &&
                      person.tags.map((tag) => {
                        return `${tag} `;
                      })}
                  </h4>
                  <h4>{person.isActive ? "Active" : "Not active"}</h4>
                </li>
              </>
            );
          })}
      </ul>
    </ListItems>
  );
};

export default Filter;
