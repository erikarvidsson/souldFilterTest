import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Filter = () => {
  const [data, setData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [tags, setTags] = useState();
  // const [status, setStatus] = useState();
  const [sortedBy, setSortedBy] = useState();
  const [order, setOrder] = useState("asc");
  const dataUrl = "https://api.dev.sould.se/";

  const ListItems = styled.div`
    .filter {
      display: flex;

      h4:nth-child(1) {
        border: 0px solid #114;
      }
      h4 {
        border: 1px solid #119;
        border-radius: 20px;

        &.active {
          border: 2px solid #114;
        }
      }
    }
    .listHeader {
      display: flex;

      h4 {
        border: 1px solid #000;
      }
    }
    h4 {
      width: 20%;
      padding-left: 10px;
    }
    ul {
      list-style-type: none;
      padding-inline-start: 0;
    }
    li {
      display: flex;
    }
  `;

  const getData = (sortedBy) =>
    fetch(`${dataUrl}${sortedBy ? sortedBy + order : ""}`).then((res) =>
      res.json()
    );

  // run get data from api
  useEffect(() => {
    getData(sortedBy).then((value) => setData(value));
  }, [sortedBy, order]);

  useEffect(() => {
    setFilteredData(data);
    getAllTags();
  }, [data]);

  const filterBySort = (sort) => {
    setSortedBy(sort);
  };

  const filterByStatus = (value) => {
    setFilteredData(data);
    // value to boolean
    value = value === "true" ? true : value === "false" ? false : "All";
    // filter data by status
    if (value === true || value === false) {
      let activeData = data.filter((obj) => {
        return obj.isActive === value;
      });

      setFilteredData(activeData);
    }
  };

  const getAllTags = () => {
    let dataTags = [];
    if (data) {
      data.map((pers) => {
        dataTags.push(pers.tags[0]);
      });

      const allTags = [...new Set(dataTags)];

      setTags(allTags);
    }
  };

  const filterByTags = (tag) => {
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

  const sortByZipCode = () => {
    const orderData = (a, b) => {
      const adressA = a.address.split(",");
      const adressB = b.address.split(",");

      return adressA[adressA.length - 1] - adressB[adressA.length - 1];
    };
    const newData = data.sort(orderData);

    console.log(filteredData)

    setFilteredData(newData);
  };

  return (
    <ListItems>
      <div className="filter">
        <h4>Sotera efter:</h4>
        <h4
          className="active"
          onClick={() => filterBySort(`?order_by=firstname&order=`)}
        >
          Förnamn
        </h4>
        <h4 onClick={() => filterBySort(`?order_by=surname&order=`)}>
          Efternamn
        </h4>
        <h4 onClick={() => filterBySort(`?order_by=age&order=`)}>Ålder</h4>
        <h4 onClick={() => sortByZipCode()}>Postnummer</h4>
        <h4>
          Order{" "}
          <select
            onChange={(e) => {
              setOrder(e.target.value);

              console.log(e.target.value);
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
        <h4>
          Tags
          <select
            onChange={(e) => {
              filterByTags(e.target.value);
            }}
          >
            <option value="" disabled selected hidden>
              Choose tag
            </option>
            {tags &&
              tags.map((tag) => {
                return (
                  <>
                    <option value={tag}>{tag}</option>
                  </>
                );
              })}
          </select>
        </h4>
        <h4>
          Status{" "}
          <select
            onChange={(e) => {
              filterByStatus(e.target.value);
            }}
          >
            <option value="" disabled selected hidden>
              Choose status
            </option>
            <option value={"all"}>All</option>
            <option value={true}>Active</option>
            <option value={false}>Not Active</option>
          </select>
        </h4>
      </div>
      <div className="listHeader">
        <h4>Förnamn</h4>
        <h4>Efternamn</h4>
        <h4>Ålder</h4>
        <h4>tags</h4>
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
