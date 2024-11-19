import './reset.css';

import { useEffect, useState } from 'react';
import { Link, Route, Routes, useLocation } from 'react-router-dom';

import friendIcon from './icons/friend.png';
import reviewIcon from './icons/review.png';
import searchIcon from './icons/search.png';
import threedotsIcon from './icons/threedots.png';
import threedotsIconActive from './icons/threedots_active.png';
import timetableIcon from './icons/timetable.png';
import timetableIconActive from './icons/timetable_active.png';
import Lecture from './Lecture';
import Lecturelist from './Lecturelist';
import MainPage from './Mainpage';
import MyPage from './Mypage';

interface MenuProps {
  token: string;
  onLogout: () => void;
}

type TimetableResponse = {
  _id: string;
  user_id: string;
  year: number;
  semester: string;
  lecture_list: Array<{
    _id: string;
    academic_year: string;
    category: string;
    class_time_json: Array<{
      day: string;
      place: string;
      startMinute: number;
      endMinute: number;
      start_time: string;
      end_time: string;
      len: number;
      start: number;
      lectureBuildings: Array<{
        id: string;
        buildingNumber: string;
        buildingNameKor: string;
        buildingNameEng: string;
        locationInDMS: {
          latitude: number;
          longitude: number;
        };
        locationInDecimal: {
          latitude: number;
          longitude: number;
        };
        campus: string;
      }>;
    }>;
    classification: string;
    credit: number;
    department: string;
    instructor: string;
    lecture_number: string;
    quota: number;
    freshman_quota: number;
    remark: string;
    course_number: string;
    course_title: string;
    color: {
      bg: string;
      fg: string;
    };
    colorIndex: number;
    lecture_id: string;
    snuttEvLecture: {
      evLectureId: number;
    };
    class_time_mask: number[];
  }>;
  title: string;
  theme: string;
  themeId: string;
  isPrimary: boolean;
  updated_at: string;
};

const Menu = ({ token, onLogout }: MenuProps) => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const [timetableData, setTimetableData] = useState<TimetableResponse | null>(
    null,
  );

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('네트워크 응답이 올바르지 않습니다.');
    }

    const data = (await response.json()) as T;
    return data;
  }

  useEffect(() => {
    const fetchTimetableData = async () => {
      try {
        const data = await fetchJSON<TimetableResponse>(
          `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/recent`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token,
            },
          },
        );
        setTimetableData(data);
      } catch (error) {
        console.error(
          '시간표 정보를 가져오는 도중 오류가 발생했습니다:',
          error,
        );
      }
    };

    void fetchTimetableData();
  }, [token]);

  //timetables 로 시작하는 경우 하단 네비게이션 바 없게
  if (activePath.startsWith('/timetables/')) {
    return (
      <Routes>
        <Route
          element={
            <Lecture
              token={token}
              timetableData={timetableData}
              setTimetableData={setTimetableData}
            />
          }
          path="/timetables/:id/lectures/:lectureId"
        />
        <Route
          element={
            <Lecturelist
              token={token}
              timetableData={timetableData}
              setTimetableData={setTimetableData}
            />
          }
          path="/timetables/:id/lectures"
        />
      </Routes>
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <Routes>
          <Route
            path="/"
            element={
              <MainPage
                token={token}
                timetableData={timetableData}
                setTimetableData={setTimetableData}
              />
            }
          />
          <Route
            path="/mypage"
            element={<MyPage token={token} onLogout={onLogout} />}
          />
        </Routes>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginLeft: '30px',
          marginRight: '30px',
          marginBottom: '15px',
          marginTop: '15px',
        }}
      >
        <Link to="/">
          <img
            src={activePath === '/' ? timetableIconActive : timetableIcon}
            alt="timetable"
            style={{
              width: '23px',
              height: '23px',
            }}
          />
        </Link>
        <img
          src={searchIcon}
          alt="search"
          style={{
            width: '30px',
            height: '30px',
          }}
        />
        <img
          src={reviewIcon}
          alt="review"
          style={{
            width: '30px',
            height: '30px',
          }}
        />
        <img
          src={friendIcon}
          alt="friend"
          style={{
            width: '30px',
            height: '30px',
          }}
        />
        <Link to="/mypage">
          <img
            src={activePath === '/mypage' ? threedotsIconActive : threedotsIcon}
            alt="threedots"
            style={{
              width: '30px',
              height: '30px',
            }}
          />
        </Link>
      </div>
    </div>
  );
};

export default Menu;
