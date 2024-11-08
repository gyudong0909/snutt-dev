import './reset.css';

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './Mainpage.module.css';

interface MainPageProps {
  token: string;
}

type TimetableResponse = {
  _id: 'string';
  user_id: 'string';
  year: 0;
  semester: '1';
  lecture_list: [
    {
      _id: 'string';
      academic_year: 'string';
      category: 'string';
      class_time_json: [
        {
          day: '0';
          place: 'string';
          startMinute: 0;
          endMinute: 0;
          start_time: 'string';
          end_time: 'string';
          len: 0;
          start: 0;
          lectureBuildings: [
            {
              id: 'string';
              buildingNumber: 'string';
              buildingNameKor: 'string';
              buildingNameEng: 'string';
              locationInDMS: {
                latitude: 0;
                longitude: 0;
              };
              locationInDecimal: {
                latitude: 0;
                longitude: 0;
              };
              campus: 'GWANAK';
            },
          ];
        },
      ];
      classification: 'string';
      credit: 0;
      department: 'string';
      instructor: 'string';
      lecture_number: 'string';
      quota: 0;
      freshman_quota: 0;
      remark: 'string';
      course_number: 'string';
      course_title: 'string';
      color: {
        bg: 'string';
        fg: 'string';
      };
      colorIndex: 0;
      lecture_id: 'string';
      snuttEvLecture: {
        evLectureId: 0;
      };
      class_time_mask: [0];
    },
  ];
  title: 'string';
  theme: '0';
  themeId: 'string';
  isPrimary: true;
  updated_at: '2024-11-08T09:35:57.664Z';
};

const MainPage = ({ token }: MainPageProps) => {
  const [TimetableData, setTimetableData] = useState<TimetableResponse>();

  useEffect(() => {
    const fetchTimetableRequest = async () => {
      const response = await fetch(
        `https://wafflestudio-seminar-2024-snutt-redirect.vercel.app/v1/tables/recent`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token,
          },
        },
      );
      return response;
    };

    const requestTimetable = async () => {
      const TimetableResponse = await fetchTimetableRequest();
      if (!TimetableResponse.ok) {
        alert('timetableRequest fetch 오류 발생');
      }
      const data = (await TimetableResponse.json()) as TimetableResponse;
      setTimetableData(data);
    };
    requestTimetable().catch((e: unknown) => {
      alert(e);
    });
  }, [token]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.frame211}>
          시간표 제목: {TimetableData?.title}
        </div>
      </div>
      <div className={styles.body}>
        {TimetableData?.lecture_list.map((lecture) => {
          return (
            <div
              key={lecture._id}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div>강의명: {lecture.course_title}</div>
              <div>교수님: {lecture.instructor}</div>
              <div>
                시간: {lecture.class_time_json[0].start_time} ~{' '}
                {lecture.class_time_json[0].end_time}
              </div>
              <div>
                {' '}
                분: {lecture.class_time_json[0].startMinute},{' '}
                {lecture.class_time_json[0].endMinute}{' '}
              </div>
              <br />
            </div>
          );
        })}
      </div>
      <Link to="/mypage">마이페이지로 이동</Link>
    </div>
  );
};

export default MainPage;
