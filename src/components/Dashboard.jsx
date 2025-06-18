import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import CourseList from "./CourseList";
import PopularCourses from "./PopularCourses";
import Statistics from "./Statistics";
import CourseCard from './CourseCard';
// import { useNavigate } from 'react-router-dom'


const Dashboard = ({ courseData }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [showSorting, setShowSorting] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [Wacthed, setWatched] = useState([]);
  
  const STORAGE_KEY = 'favorites';
  const STORAGE =   "watched";
  const STORAGE_TAG = "tags";
  const STORAGE_SORT = "sortOption";

  // const navigate = useNavigate();



    useEffect(() => {
    loadFavorites();
    loadWatched();
    loadTags();
    loadSort();
  }, []);

  useEffect(() => {
  saveSort(sortOption);
}, [sortOption]);

    const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  };

    const loadWatched = async () => {
    const stored = await AsyncStorage.getItem(STORAGE);
    if (stored) {
      setWatched(JSON.parse(stored));
    }
  };

  const loadTags = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_TAG);
    if (stored) {
      setSelectedTags(JSON.parse(stored));
    }
  };

  const loadSort = async () => {
    const stored = await AsyncStorage.getItem(STORAGE_SORT);
    if (stored) {
      setSortOption(stored);
    }
  };

  const saveFavorites = async (newFavs) => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
  };

  const saveWatched = async (newwatch) => {
    await AsyncStorage.setItem(STORAGE, JSON.stringify(newwatch));
  };

  const saveTags = async (newTags) => {
    await AsyncStorage.setItem(STORAGE_TAG, JSON.stringify(newTags));
  };

  const saveSort = async (option) => {
    await AsyncStorage.setItem(STORAGE_SORT, option ?? "");
  };

  const toggleFavorite = async (course) => {
    const isFav = favorites.some(f => f.id === course.id);
    const updated = isFav
      ? favorites.filter(f => f.id !== course.id)
      : [...favorites, course]; // Save full course

    setFavorites(updated);
    await saveFavorites(updated);
  };

  const toggleWatched = async (course) => {
    const isWatch = Wacthed.some(w => w.id === course.id);
    const updated = isWatch
      ? Wacthed.filter(w => w.id !== course.id)
      : [...Wacthed, course]; // Save full course

    setWatched(updated);
    await saveWatched(updated);
  };

  const filteredCourses = () => {
    if (!courseData || !Array.isArray(courseData)) return [];

    let filtered = [...courseData];

    if (activeTab === "beginner") {
      filtered = filtered.filter((course) => course.level === "Beginner");
    } else if (activeTab === "gemiddeld") {
      filtered = filtered.filter((course) => course.level === "Gemiddeld");
    } else if (activeTab === "gevorderd") {
      filtered = filtered.filter((course) => course.level === "Gevorderd");
    } else if (activeTab === "populair") {
      filtered.sort((a, b) => b.views - a.views);
    } else if (activeTab === "favorite") {
      filtered = filtered.filter(course =>
        favorites.some(fav => fav.id === course.id)
      );
    } else if (activeTab === "watched") {
      filtered = filtered.filter(course =>
        Wacthed.some(watch => watch.id === course.id)
      );
    };

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter((course) =>
        course.categories.some((category) => selectedTags.includes(category))
      );
    }

    if (sortOption) {
      const [type, direction] = sortOption.split("-");

      if (type === "duration") {
        const parseDuration = (str) => {
          const match = str.match(/(\d+)\s*uur/i);
          return match ? parseInt(match[1]) : 0;
        };

        filtered.sort((a, b) => {
          const aDur = parseDuration(a.duration);
          const bDur = parseDuration(b.duration);
          return direction === "desc" ? bDur - aDur : aDur - bDur;
        });
      } else if (type === "views" || type === "rating") {
        filtered.sort((a, b) => {
          const aVal = a[type] ?? 0;
          const bVal = b[type] ?? 0;
          return direction === "desc" ? bVal - aVal : aVal - bVal;
        });
      }
    }
    return filtered;
  };

  const allCategories = [
    ...new Set(courseData.flatMap((course) => course.categories))
  ];

  const handleTagClick = (tag) => {
    const updated = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(updated);
    saveTags(updated);
  };

  return (
    <section className="dashboard">
      {/* <header>
        <button>
          <img
            className="profile-icon"
            // src={profileIcon}
            alt="Profiel"
            onClick={() => navigate("/profile")}
          />
        </button>
      </header> */}
      <header className="dashboard-header">
        <div className="search-bar">
          <input
            className="search-input"
            type="text"
            placeholder="Zoeken"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') { setSearchTerm(query) }
            }}
          />
          <button
            className="search-button"
            onClick={() => setSearchTerm(query)}
          >
            Zoeken
          </button>
        </div>
        <nav className="tab-buttons">
          <button
            className={activeTab === "all" ? "active" : ""}
            onClick={() => setActiveTab("all")}
          >
            Alle Cursussen
          </button>
          <button
            className={activeTab === "beginner" ? "active" : ""}
            onClick={() => setActiveTab("beginner")}
          >
            Voor Beginners
          </button>
          <button
            className={activeTab === "gemiddeld" ? "active" : ""}
            onClick={() => setActiveTab("gemiddeld")}
          >
            Gemiddeld
          </button>
          <button
            className={activeTab === "gevorderd" ? "active" : ""}
            onClick={() => setActiveTab("gevorderd")}
          >
            Gevorderd
          </button>
          <button
            className={activeTab === "populair" ? "active" : ""}
            onClick={() => setActiveTab("populair")}
          >
            Meest Bekeken
          </button>
          <button
            className={activeTab === "favorite" ? "active" : ""}
            onClick={() => setActiveTab("favorite")}
          >
            Favorieten
          </button>
                    <button
            className={activeTab === "watched" ? "active" : ""}
            onClick={() => setActiveTab("watched")}
          >
            Bekeken
          </button>
          <button 
            className="tab-buttons"
            onClick={() => setShowCategories(!showCategories)}
          >
            Categorieën
          </button>
          <button 
            className="tab-buttons"
            onClick={() => setShowSorting(!showSorting)}
          >
            Sorteeropties
          </button>
          {showCategories && (
            <div className="tag-buttons">
              {allCategories.map((tag) => (
                <button
                  key={tag}
                  className={selectedTags.includes(tag) ? "active" : ""}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
          {showSorting && (
            <div className="tag-buttons">
              {["views", "duration", "rating"].map((option) => (
                <button
                  key={option}
                  className={sortOption?.startsWith(option) ? "active" : ""}
                  onClick={() => {
                    if (!sortOption || !sortOption.startsWith(option)) {
                      setSortOption(`${option}-desc`);
                    } else if (sortOption === `${option}-desc`) {
                      setSortOption(`${option}-asc`);
                    } else {
                      setSortOption(null);
                    }
                  }}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}{" "}
                  {sortOption === `${option}-desc` ? "↓" : sortOption === `${option}-asc` ? "↑" : ""}
                </button>
              ))}
            </div>
          )}
        </nav>
      </header>

      <div className="dashboard-content">
        <section className="main-content">
          <h2>
            {activeTab === "all"
              ? "Alle Cursussen"
              : activeTab === "beginner"
              ? "Cursussen voor Beginners"
              : activeTab === "gemiddeld"
              ? "Gemiddelde Cursussen"
              : activeTab === "gevorderd"
              ? "Gevorderde Cursussen"
              : activeTab === "favorite"
              ? "Favoriete Cursussen"
              : activeTab === "watched"
              ? "Bekeken Cursussen"
              : "Meest Bekeken Cursussen"}
          </h2>

          <div className="course-list">
            {filteredCourses().map(course => (
              <CourseCard
                key={course.id}
                course={course}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                watched={Wacthed}
                toggleWatched={toggleWatched}
              />
            ))}
          </div>
        </section>


        <aside className="sidebar">
          <PopularCourses courses={courseData} />
          <Statistics courses={courseData} />
        </aside>
      </div>
    </section>
  );
};

export default Dashboard;

