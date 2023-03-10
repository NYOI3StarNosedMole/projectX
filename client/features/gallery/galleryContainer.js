import React from 'react';
import { ImageComponent } from './imageComponent';
import { useEffect, useState, useCallback } from 'react';
const axios = require('axios');

export function GalleryContainer({ submittedSearchTerm }) {
  const [urls, setURLs] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [keepUpdating, setKeepUpdating] = useState(true);
  const [currSearchTerm, setCurrSearchTerm] = useState('');

  useEffect(() => {
    if (submittedSearchTerm !== currSearchTerm) {
      setPageNumber(1);
      setURLs([]);
      setKeepUpdating(true);
      setCurrSearchTerm(submittedSearchTerm);
    }
  }, [submittedSearchTerm]);

  useEffect(() => {
    if (!keepUpdating) return;
    if (currSearchTerm.length) {
      (async () => {
        const res = await axios(
          `http://localhost:3000/search?pg=${pageNumber}&keyword=${currSearchTerm}`,
          {
            mode: 'no-cors'
          }
        );
        const arr = res.data;
        if (arr.length !== 16) setKeepUpdating(false);
        setURLs((oldURLs) => [...oldURLs, ...arr]);
      })();
    } else {
      (async () => {
        const res = await axios(
          `http://localhost:3000/images?pg=${pageNumber}`,
          {
            mode: 'no-cors'
          }
        );
        const arr = res.data;
        if (arr.length !== 16) setKeepUpdating(false);
        setURLs((oldURLs) => [...oldURLs, ...arr]);
      })();
    }
  }, [pageNumber, currSearchTerm]);

  //Infinite scrolling logic.
  const onScroll = useCallback(() => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    if (scrollTop + clientHeight >= scrollHeight) {
      setPageNumber(pageNumber + 1);
    }
  }, [pageNumber]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, [onScroll]);

  const toRender = urls.map((url) => {
    return <ImageComponent key={Math.random() + Date.now()} imgUrl={url} />;
  });

  return <div className="galleryContainer">{toRender}</div>;
}
