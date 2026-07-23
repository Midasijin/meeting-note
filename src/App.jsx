import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Play, 
  Copy, 
  Save, 
  Mail, 
  MessageSquare, 
  AlertTriangle, 
  TrendingUp, 
  Trash2, 
  Info, 
  User, 
  ExternalLink,
  CheckSquare,
  Clock,
  Layers,
  Database
} from 'lucide-react';
import { getSupabaseClient } from './supabaseClient';

function App() {
   const [activeTab, setActiveTab] = useState('analytics');
   
   // 3D 부서 시너지 네트워크 맵 상태
   const [networkData, setNetworkData] = useState({
     parent: { name: '기획부', meetings: 12, ideas: 8 },
     orbitals: [
       { id: 'dev', name: '개발팀', meetings: 24, ideas: 15, synergyScore: 85 },
       { id: 'mkt', name: '마케팅팀', meetings: 10, ideas: 6, synergyScore: 40 },
       { id: 'design', name: '디자인팀', meetings: 14, ideas: 9, synergyScore: 70 }
     ]
   });

   // 아이디어 뱅크용 상태
   const [ideas, setIdeas] = useState([]);
   const [isInferring, setIsInferring] = useState(false);
   const [selectedIdeaMeetings, setSelectedIdeaMeetings] = useState([]);
   const [showIdeaArchiveToggle, setShowIdeaArchiveToggle] = useState(false);
   const [newIdeaTitle, setNewIdeaTitle] = useState('');
   const [newIdeaConcept, setNewIdeaConcept] = useState('');
   const [newIdeaHumanInput, setNewIdeaHumanInput] = useState('');
   
    // 2D Obsidian 스타일 성좌 그래프 맵 상태
    const [nodePositions, setNodePositions] = useState({
      parent: { x: 250, y: 190 },
      dev: { x: 130, y: 110 },
      mkt: { x: 370, y: 110 },
      design: { x: 250, y: 280 }
    });
    const [draggedNodeId, setDraggedNodeId] = useState(null);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [hoveredNode, setHoveredNode] = useState(null);

    // 신규 아이디어가 생성되거나 변경될 때 주변 방사형 각도 계산으로 자식 노드 좌표 동적 부여
    useEffect(() => {
      setNodePositions(prev => {
        const next = { ...prev };
        
        // 기본 메인 노드 좌표가 없으면 보정
        if (!next.parent) next.parent = { x: 250, y: 190 };
        if (!next.dev) next.dev = { x: 130, y: 110 };
        if (!next.mkt) next.mkt = { x: 370, y: 110 };
        if (!next.design) next.design = { x: 250, y: 280 };
        
        // ideas 배열 내부의 항목을 매핑하여 하위 가지 노드 좌표 생성
        ideas.forEach((idea, idx) => {
          const id = `idea-${idea.id || idx}`;
          if (!next[id]) {
            // 해당 아이디어 발제 부서에 매핑되는 부서 중심점 찾기
            let cx = 250, cy = 190;
            if (idea.authorDept === '개발팀') {
              cx = 130; cy = 110;
            } else if (idea.authorDept === '마케팅팀') {
              cx = 370; cy = 110;
            } else if (idea.authorDept === '디자인팀') {
              cx = 250; cy = 280;
            }
            
            // 흩뿌리기 방사 연산
            const angle = (idx * 1.3) + Math.random() * 0.4;
            const radius = 40 + Math.random() * 25;
            next[id] = {
              x: Math.max(30, Math.min(470, cx + Math.cos(angle) * radius)),
              y: Math.max(30, Math.min(350, cy + Math.sin(angle) * radius))
            };
          }
        });
        return next;
      });
    }, [ideas]);
  
  // 로그인 및 프로필 인증 상태
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authMode, setAuthMode] = useState('login');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingName, setOnboardingName] = useState('');
  const [onboardingDept, setOnboardingDept] = useState('');
  const [customDeptName, setCustomDeptName] = useState('');
  const [departments, setDepartments] = useState([
    { id: '1', name: '개발부' },
    { id: '2', name: '기획부' },
    { id: '3', name: '디자인부' },
    { id: '4', name: '마케팅부' },
    { id: '5', name: '영업부' },
    { id: '6', name: '인사총무부' },
    { id: '7', name: '재무회계부' },
    { id: '8', name: '홍보부' },
    { id: '9', name: '고객지원부' },
    { id: '10', name: '경영지원부' }
  ]);

  // 입력 상태
  const [rawText, setRawText] = useState('');
  const [attendees, setAttendees] = useState('');
  
  // 시스템 설정 상태
  const [geminiKey, setGeminiKey] = useState('');
  const [slackUrl, setSlackUrl] = useState('');
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseKey, setSupabaseKey] = useState('');
  const [kakaoKey, setKakaoKey] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [settingsStatus, setSettingsStatus] = useState('');
  
  // AI 분석 결과 상태
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [refinedContent, setRefinedContent] = useState('');
  const [extractedAttendees, setExtractedAttendees] = useState('');
  const [actionItems, setActionItems] = useState([]);
  const [synergyAnalysis, setSynergyAnalysis] = useState(null);
  const [publicSummary, setPublicSummary] = useState('');
  
  // 아카이브 리스트
  const [archiveList, setArchiveList] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  
  // 상태 메시지
  const [saveStatus, setSaveStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [emailStatus, setEmailStatus] = useState('');
  const [slackStatus, setSlackStatus] = useState('');
  const [emailRecipient, setEmailRecipient] = useState('');

  // 아이디어 뱅크 핵심 연동 함수들
  const publishNewIdea = () => {
    if (!newIdeaTitle.trim() || !newIdeaConcept.trim()) {
      alert('아이디어 제목과 핵심 컨셉을 입력해주세요.');
      return;
    }

    const currentAuthorDept = userProfile?.departmentName || '개발부';
    const isDataBased = selectedIdeaMeetings.length > 0;
    
    // 인용 자료 매핑
    const citations = selectedIdeaMeetings.map(id => {
      const meeting = archiveList.find(m => m.id === id);
      return meeting ? { id: meeting.id, title: meeting.title, date: meeting.date } : null;
    }).filter(Boolean);

    const newIdea = {
      id: 'idea-' + Date.now(),
      title: newIdeaTitle.trim(),
      concept: newIdeaConcept.trim(),
      humanInput: newIdeaHumanInput.trim(),
      authorName: userProfile?.fullName || '데모 사용자',
      authorDept: currentAuthorDept,
      date: new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }),
      isDataBased,
      citations,
      likes: 0,
      comments: []
    };

    const updatedIdeas = [newIdea, ...ideas];
    setIdeas(updatedIdeas);
    localStorage.setItem('idea_history', JSON.stringify(updatedIdeas));

    // State Synchronization: Network Map 연동
    setNetworkData(prev => {
      let nextParent = { ...prev.parent };
      let nextOrbitals = prev.orbitals.map(orb => ({ ...orb }));

      // 글쓴이의 부서에 매핑
      const isParent = currentAuthorDept.includes('기획');
      if (isParent) {
        nextParent.ideas += 1;
        // 기획부에서 발행하면 모든 궤도 노드와의 시너지를 소폭(각 +5) 증가시킴
        nextOrbitals = nextOrbitals.map(orb => ({
          ...orb,
          synergyScore: Math.min(100, orb.synergyScore + 5)
        }));
      } else {
        // orbitals 중 부서 이름이 매칭되는 노드 찾기
        let targetId = 'dev';
        if (currentAuthorDept.includes('개발')) targetId = 'dev';
        else if (currentAuthorDept.includes('마케팅')) targetId = 'mkt';
        else if (currentAuthorDept.includes('디자인')) targetId = 'design';
        else {
          const keys = ['dev', 'mkt', 'design'];
          targetId = keys[Math.floor(Math.random() * keys.length)];
        }

        nextOrbitals = nextOrbitals.map(orb => {
          if (orb.id === targetId) {
            return {
              ...orb,
              ideas: orb.ideas + 1,
              synergyScore: Math.min(100, orb.synergyScore + 10)
            };
          }
          return orb;
        });
      }

      return { parent: nextParent, orbitals: nextOrbitals };
    });

    // 상태값 초기화
    setNewIdeaTitle('');
    setNewIdeaConcept('');
    setNewIdeaHumanInput('');
    setSelectedIdeaMeetings([]);
    setShowIdeaArchiveToggle(false);
  };

  const handleLikeIdea = (ideaId) => {
    const currentUserId = user?.id || userProfile?.fullName || 'demo-user';
    const updated = ideas.map(idea => {
      if (idea.id === ideaId) {
        const likedBy = idea.likedBy || [];
        const hasLiked = likedBy.includes(currentUserId);
        
        let nextLikes = idea.likes;
        let nextLikedBy = [...likedBy];
        
        if (hasLiked) {
          nextLikes = Math.max(0, nextLikes - 1);
          nextLikedBy = nextLikedBy.filter(uid => uid !== currentUserId);
          updateNetworkSynergy(idea.authorDept, -2);
        } else {
          nextLikes = nextLikes + 1;
          nextLikedBy.push(currentUserId);
          updateNetworkSynergy(idea.authorDept, 2);
        }
        
        return { ...idea, likes: nextLikes, likedBy: nextLikedBy };
      }
      return idea;
    });
    setIdeas(updated);
    localStorage.setItem('idea_history', JSON.stringify(updated));
  };

  const handleDeleteIdea = async (ideaId) => {
    if (!confirm('정말로 이 아이디어를 삭제하시겠습니까?')) return;
    if (supabase) {
      try {
        await supabase.from('ideas').delete().eq('id', ideaId);
      } catch (e) {
        console.error('Supabase delete error:', e);
      }
    }
    const updated = ideas.filter(idea => idea.id !== ideaId);
    setIdeas(updated);
    localStorage.setItem('idea_history', JSON.stringify(updated));
  };

  const handleAddComment = (ideaId, commentText) => {
    if (!commentText.trim()) return;

    const updated = ideas.map(idea => {
      if (idea.id === ideaId) {
        const newComment = {
          id: 'comment-' + Date.now(),
          author: userProfile?.fullName || '데모 사용자',
          text: commentText.trim(),
          date: new Date().toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        };
        // State Synchronization: 댓글 등록 시 시너지 점수 +3 상승
        updateNetworkSynergy(idea.authorDept, 3);
        return { ...idea, comments: [...idea.comments, newComment] };
      }
      return idea;
    });
    setIdeas(updated);
    localStorage.setItem('idea_history', JSON.stringify(updated));
  };

  const updateNetworkSynergy = (deptName, points) => {
    setNetworkData(prev => {
      let nextOrbitals = prev.orbitals.map(orb => ({ ...orb }));
      let nextParent = { ...prev.parent };

      if (deptName.includes('기획')) {
        nextOrbitals = nextOrbitals.map(orb => ({
          ...orb,
          synergyScore: Math.min(100, orb.synergyScore + points)
        }));
      } else {
        let targetId = 'dev';
        if (deptName.includes('개발')) targetId = 'dev';
        else if (deptName.includes('마케팅')) targetId = 'mkt';
        else if (deptName.includes('디자인')) targetId = 'design';
        
        nextOrbitals = nextOrbitals.map(orb => {
          if (orb.id === targetId) {
            return { ...orb, synergyScore: Math.min(100, orb.synergyScore + points) };
          }
          return orb;
        });
      }
      return { parent: nextParent, orbitals: nextOrbitals };
    });
  };

  const triggerAiIdeaExtraction = () => {
    if (selectedIdeaMeetings.length === 0) return;
    setIsInferring(true);
    
    // 시뮬레이션된 AI 인퍼런스 1초 지연 후 자동완성
    setTimeout(() => {
      setIsInferring(false);
      
      const selectedTitles = selectedIdeaMeetings.map(id => {
        const m = archiveList.find(meet => meet.id === id);
        return m ? m.title : '';
      }).filter(Boolean);

      // 인용 번호와 매치한 AI 초안 생성
      const mainMeetingTitle = selectedTitles[0] || '회의록';
      
      setNewIdeaTitle(`[AI 추출] ${mainMeetingTitle} 연계 시너지 플랫폼 모델`);
      setNewIdeaConcept(`선택해주신 회의록 [${mainMeetingTitle}][1]의 논의 사항을 적극 반영하여, 부서 간 실시간 리액티브 상태를 기반으로 한 업무 최적화 솔루션을 제안합니다. 이 플랫폼 모델은 리소스의 모순 일정을 조기 감지하고 부서 간 시너지 협업 주기를 최대 35% 단축하도록 고안되었습니다.[2]`);
    }, 1000);
  };

  // 설정 로드 및 세션 체크
  useEffect(() => {
    // 데모용 회의록 아카이브 데이터 Seeding (없을 시)
    if (!localStorage.getItem('meeting_history')) {
      const demoMeetings = [
        {
          id: 'meet-demo-1',
          title: '6월 25일 기획부-개발팀 연계 사양 회의',
          date: '2026-06-25',
          attendees: '김기획, 이개발, 박디자인',
          content: '각 부서의 실시간 업무 리스크를 사전 경고하는 캘린더 대시보드를 프론트엔드에 추가해야 함. 이를 통해 마찰 일정을 조기 감지하는 방안 논의.',
          publicSummary: '부서 간 리스크 경보 대시보드 스펙 구체화',
          actionItems: [{ id: 'act-1', task: '리스크 분석 컴포넌트 목업 구현', assignee: '이개발', due: '2026-07-02', status: 'pending' }],
          synergyAnalysis: null,
          url: '#'
        },
        {
          id: 'meet-demo-2',
          title: '6월 27일 마케팅부 채널 전략 회의',
          date: '2026-06-27',
          attendees: '최마케, 정홍보',
          content: '신규 기능 런칭에 맞춘 전사 마케팅 캠페인 수립. 개발부의 배포 일정과 싱크를 맞추어 7월 중순 런칭 타이밍 확보 필요.',
          publicSummary: '런칭 맞춤형 마케팅 캠페인 계획 수립',
          actionItems: [{ id: 'act-2', task: '캠페인 기획서 초안 작성', assignee: '최마케', due: '2026-07-05', status: 'completed' }],
          synergyAnalysis: null,
          url: '#'
        },
        {
          id: 'meet-demo-3',
          title: '6월 29일 디자인 시스템 고도화 회의',
          date: '2026-06-29',
          attendees: '박디자인, 이디전',
          content: 'Luminescent Aurora Minimalist 테마의 시각적 요소 정리. 오로라 글로우 효과와 더블 베젤 카드의 반응형 예외 처리에 집중.',
          publicSummary: '오로라 미니멀 테마 컴포넌트 가이드 정리',
          actionItems: [{ id: 'act-3', task: '더블 베젤 카드 CSS 리팩토링', assignee: '박디자인', due: '2026-07-01', status: 'pending' }],
          synergyAnalysis: null,
          url: '#'
        }
      ];
      localStorage.setItem('meeting_history', JSON.stringify(demoMeetings));
    }

    // 데모용 아이디어 데이터 Seeding (없을 시)
    const savedIdeas = localStorage.getItem('idea_history');
    if (!savedIdeas) {
      const demoIdeas = [
        {
          id: 'idea-demo-1',
          title: 'AI 기반 부서 리소스 충돌 및 일정 최적화 모델',
          concept: '선택해주신 회의록 [6월 25일 기획부-개발팀 연계 사양 회의][1]의 논의 사항을 적극 반영하여, 부서 간 실시간 리액티브 상태를 기반으로 한 업무 최적화 솔루션을 제안합니다. 이 플랫폼 모델은 리소스의 모순 일정을 조기 감지하고 부서 간 시너지 협업 주기를 최대 35% 단축하도록 고안되었습니다.[2]',
          humanInput: '추후 개발부 서버의 실시간 리소스 API 명세가 정의되면 즉각 결합하여 실제 가동률을 모니터링할 필요가 있어 보입니다.',
          authorName: '김기획',
          authorDept: '기획부',
          date: '2026년 6월 29일',
          isDataBased: true,
          citations: [
            { id: 'meet-demo-1', title: '6월 25일 기획부-개발팀 연계 사양 회의', date: '2026-06-25' }
          ],
          likes: 8,
          comments: [
            { id: 'comment-demo-1', author: '이개발', text: '매우 동의합니다. 실시간 상태 연계가 가능하면 좋겠습니다.', date: '6월 29일 오후 02:40' }
          ]
        },
        {
          id: 'idea-demo-2',
          title: '글로벌 브랜딩을 위한 디자인 에셋 통합 대시보드',
          concept: '디자인부의 디자인 시스템 고도화 회의록[1]에 기술된 Aurora Minimalist 스타일 가이드를 기반으로 하여, 전사 브랜드 이미지 일관성을 유지할 수 있는 에셋 통합 중앙 관리소를 제안합니다. 마케팅팀의 마케팅 런칭 캠페인 시 디자인 리소스를 즉시 다운로드하여 병목 현상을 해결할 수 있습니다.[2]',
          humanInput: '피그마 API 연동을 도입해 디자인 라이브러리의 컴포넌트를 즉각 가져오면 더 좋겠습니다.',
          authorName: '박디자인',
          authorDept: '디자인팀',
          date: '2026년 6월 30일',
          isDataBased: true,
          citations: [
            { id: 'meet-demo-3', title: '6월 29일 디자인 시스템 고도화 회의', date: '2026-06-29' }
          ],
          likes: 5,
          comments: []
        }
      ];
      localStorage.setItem('idea_history', JSON.stringify(demoIdeas));
      setIdeas(demoIdeas);
    } else {
      setIdeas(JSON.parse(savedIdeas));
    }

    const key = import.meta.env.VITE_GEMINI_API_KEY 
      || localStorage.getItem('gemini_api_key') 
      || '';
    setGeminiKey(key);
    setSlackUrl(localStorage.getItem('slack_webhook_url') || '');
    setSupabaseUrl(localStorage.getItem('supabase_url') || '');
    setSupabaseKey(localStorage.getItem('supabase_anon_key') || '');
    setKakaoKey(localStorage.getItem('kakao_javascript_key') || '');
    
    const savedDemo = localStorage.getItem('is_demo_mode');
    setIsDemoMode(savedDemo !== 'false');
    
    const supabase = getSupabaseClient();
    if (supabase) {
      checkUserSession(supabase);
      fetchDepartmentsList(supabase);
      
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session) {
          setUser(session.user);
          fetchUserProfile(supabase, session.user.id);
          fetchDepartmentsList(supabase);
        } else if (_event === 'SIGNED_OUT') {
          // 이메일 확인 대기 같은 interim 상태에선 리셋하지 않음
          setUser(null);
          setUserProfile(null);
        }
      });
      
      return () => {
        subscription.unsubscribe();
      };
    } else {
      loadLocalDemoUser();
    }
  }, [supabaseUrl, supabaseKey]);

  const checkUserSession = async (client) => {
    if (!client) {
      loadLocalDemoUser();
      return;
    }
    try {
      const { data: { session }, error } = await client.auth.getSession();
      if (error) throw error;
      if (session) {
        setUser(session.user);
        await fetchUserProfile(client, session.user.id);
      } else {
        setUser(null);
        setUserProfile(null);
      }
    } catch (e) {
      console.warn('Session check failed:', e);
      loadLocalDemoUser();
    }
  };

  const loadLocalDemoUser = () => {
    const savedUser = localStorage.getItem('demo_user');
    const savedProfile = localStorage.getItem('demo_profile');
    if (savedUser && savedProfile) {
      const parsedUser = JSON.parse(savedUser);
      const parsedProfile = JSON.parse(savedProfile);
      setUser(parsedUser);
      setUserProfile(parsedProfile);
      loadLocalHistoryFiltered(parsedProfile.departmentId);
    } else {
      setUser(null);
      setUserProfile(null);
    }
  };

  const fetchUserProfile = async (client, userId) => {
    try {
      const { data, error } = await client
        .from('profiles')
        .select('*, departments(name)')
        .eq('id', userId)
        .maybeSingle();
      
      if (error) throw error;
      if (data) {
        const profileData = {
          fullName: data.full_name,
          departmentId: data.department_id,
          departmentName: data.departments ? data.departments.name : '미지정',
          role: data.role
        };
        setUserProfile(profileData);
        setShowOnboarding(false);
        await loadMeetingsList(client, data.department_id);
      } else {
        setShowOnboarding(true);
      }
    } catch (e) {
      console.error('Profile fetch failed:', e);
    }
  };

  const fetchDepartmentsList = async (client) => {
    if (!client) return;
    try {
      const { data, error } = await client.from('departments').select('*');
      if (error) throw error;
      
      const defaultDepts = [
        '개발부', '기획부', '디자인부', '마케팅부', '영업부',
        '인사총무부', '재무회계부', '홍보부', '고객지원부', '경영지원부'
      ];
      
      if (data) {
        // Find missing departments
        const existingNames = new Set(data.map(d => d.name));
        const missing = defaultDepts.filter(name => !existingNames.has(name));
        
        if (missing.length > 0) {
          try {
            await client.from('departments').insert(missing.map(name => ({ name })));
            // Re-fetch
            const { data: updatedData } = await client.from('departments').select('*');
            if (updatedData) {
              setDepartments(updatedData);
              return;
            }
          } catch (e) {
            console.warn('Auto-seeding departments failed:', e);
          }
        }
        
        if (data.length > 0) {
          setDepartments(data);
        }
      }
    } catch (e) {
      console.warn('Departments fetch failed:', e);
    }
  };

  const handleSignIn = async (e) => {
    e?.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword) { setAuthError('이메일과 비밀번호를 입력해주세요.'); return; }
    
    const supabase = getSupabaseClient();
    if (!supabase) { setAuthError('Supabase 연동 설정이 필요합니다. 설정 탭을 확인해주세요.'); return; }
    
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password: authPassword
      });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(supabase, data.user.id);
        await fetchDepartmentsList(supabase);
      }
    } catch (err) {
      setAuthError('로그인 실패: ' + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const resolveOrCreateDepartment = async (supabase, deptSelectVal, customNameVal) => {
    if (deptSelectVal !== 'etc') {
      return deptSelectVal;
    }
    const trimmedName = customNameVal.trim();
    if (!trimmedName) throw new Error('직접 입력할 부서명을 작성해주세요.');
    
    // 1. Check if department already exists
    const { data: existing } = await supabase
      .from('departments')
      .select('id')
      .eq('name', trimmedName)
      .maybeSingle();
      
    if (existing) {
      return existing.id;
    }
    
    // 2. Insert new department
    const { data: inserted, error: insertErr } = await supabase
      .from('departments')
      .insert([{ name: trimmedName }])
      .select();
      
    if (insertErr) throw insertErr;
    if (inserted && inserted[0]) {
      await fetchDepartmentsList(supabase);
      return inserted[0].id;
    }
    throw new Error('새 부서 생성에 실패했습니다.');
  };

  const resolveOrCreateDepartmentLocal = (deptSelectVal, customNameVal) => {
    if (deptSelectVal !== 'etc') {
      return deptSelectVal;
    }
    const trimmedName = customNameVal.trim();
    if (!trimmedName) return 'etc';
    
    const exists = departments.find(d => d.name === trimmedName);
    if (exists) return exists.id;
    
    const newId = String(Date.now());
    setDepartments(prev => [...prev, { id: newId, name: trimmedName }]);
    return newId;
  };

  const handleSignUp = async (e) => {
    e?.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword) { setAuthError('이메일과 비밀번호를 입력해주세요.'); return; }
    if (authPassword.length < 6) { setAuthError('비밀번호는 6자 이상이어야 합니다.'); return; }
    if (!onboardingName.trim()) { setAuthError('이름을 입력해주세요.'); return; }
    if (!onboardingDept) { setAuthError('소속 부서를 선택해주세요.'); return; }
    if (onboardingDept === 'etc' && !customDeptName.trim()) { setAuthError('부서명을 직접 입력해주세요.'); return; }
    
    const supabase = getSupabaseClient();
    if (!supabase) {
      setAuthError('Supabase 연동 설정이 필요합니다. 설정 탭을 확인해주세요.');
      return;
    }
    setAuthLoading(true);
    
    try {
      // 1. Resolve department ID
      const resolvedDeptId = await resolveOrCreateDepartment(supabase, onboardingDept, customDeptName);

      const { data, error } = await supabase.auth.signUp({
        email: authEmail,
        password: authPassword
      });
      if (error) throw error;

      if (data.user) {
        const updatedDepts = await supabase.from('departments').select('*');
        const selectedDept = (updatedDepts.data || departments).find(d => d.id === resolvedDeptId);

        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            full_name: onboardingName,
            department_id: resolvedDeptId,
            updated_at: new Date().toISOString()
          });
        if (profileError) throw profileError;

        setUser(data.user);
        setUserProfile({
          fullName: onboardingName,
          departmentId: resolvedDeptId,
          departmentName: selectedDept ? selectedDept.name : (onboardingDept === 'etc' ? customDeptName.trim() : '미지정'),
          role: 'member'
        });
        
        await loadMeetingsList(supabase, resolvedDeptId);
        await fetchDepartmentsList(supabase);
        setShowOnboarding(false);
      }
    } catch (err) {
      setAuthError('회원가입 실패: ' + err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const supabase = getSupabaseClient();
    if (!supabase) {
      alert('Supabase 연동 설정이 되어있지 않습니다.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err) {
      alert('구글 로그인 오류: ' + err.message);
    }
  };

  const handleSignOut = async () => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('demo_user');
    localStorage.removeItem('demo_profile');
    setUser(null);
    setUserProfile(null);
    setArchiveList([]);
  };

  const handleOnboardingSubmit = async (e) => {
    e?.preventDefault();
    if (!onboardingName.trim()) return alert('이름을 입력해주세요.');
    if (!onboardingDept) return alert('부서를 선택해주세요.');
    if (onboardingDept === 'etc' && !customDeptName.trim()) return alert('부서명을 직접 입력해주세요.');
    
    const supabase = getSupabaseClient();
    
    if (supabase && user && user.id !== 'demo-user') {
      try {
        const resolvedDeptId = await resolveOrCreateDepartment(supabase, onboardingDept, customDeptName);
        
        const updatedDepts = await supabase.from('departments').select('*');
        const selectedDept = (updatedDepts.data || departments).find(d => d.id === resolvedDeptId);

        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            full_name: onboardingName,
            department_id: resolvedDeptId,
            updated_at: new Date().toISOString()
          });
        if (error) throw error;
        
        setUserProfile({
          fullName: onboardingName,
          departmentId: resolvedDeptId,
          departmentName: selectedDept ? selectedDept.name : (onboardingDept === 'etc' ? customDeptName.trim() : '미지정'),
          role: 'member'
        });
        setShowOnboarding(false);
        await loadMeetingsList(supabase, resolvedDeptId);
      } catch (err) {
        alert('온보딩 저장 오류: ' + err.message);
      }
    } else {
      const resolvedDeptId = resolveOrCreateDepartmentLocal(onboardingDept, customDeptName);
      const mockUser = { id: 'demo-user', email: authEmail || 'demo@meetingnote.com' };
      const selectedDept = departments.find(d => d.id === resolvedDeptId);
      const mockProfile = {
        fullName: onboardingName,
        departmentId: resolvedDeptId,
        departmentName: selectedDept ? selectedDept.name : (onboardingDept === 'etc' ? customDeptName.trim() : '개발부'),
        role: 'member'
      };
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      localStorage.setItem('demo_profile', JSON.stringify(mockProfile));
      setUser(mockUser);
      setUserProfile(mockProfile);
      setShowOnboarding(false);
      loadLocalHistoryFiltered(resolvedDeptId);
    }
  };


  const loadMeetingsList = async (client, deptId) => {
    if (!client) {
      loadLocalHistoryFiltered(deptId);
      return;
    }
    try {
      let query = client.from('meetings').select('*').order('created_at', { ascending: false });
      if (deptId) {
        query = query.eq('department_id', deptId);
      }
      const { data, error } = await query;
      if (error) throw error;
      if (data && data.length > 0) {
        const formatted = data.map(m => ({
          id: m.id,
          title: m.title || '무제 회의',
          date: m.meeting_date,
          attendees: m.ai_attendees || '미정',
          content: m.refined_content,
          publicSummary: m.public_summary || '',
          actionItems: m.action_items || [],
          synergyAnalysis: null,
          url: '#'
        }));
        setArchiveList(formatted);
      } else {
        loadLocalHistoryFiltered(deptId);
      }
    } catch (e) {
      console.warn('Meetings load failed, fallback local:', e);
      loadLocalHistoryFiltered(deptId);
    }
  };

  const loadLocalHistoryFiltered = (deptId) => {
    try {
      const localData = JSON.parse(localStorage.getItem('meeting_history') || '[]');
      const selectedDept = departments.find(d => d.id === deptId);
      const deptName = selectedDept ? selectedDept.name : '개발부';
      
      const filtered = localData.filter(item => {
        return !item.departmentName || item.departmentName === deptName;
      });
      setArchiveList(filtered);
    } catch(e) {
      setArchiveList([]);
    }
  };

  const loadLocalHistory = () => {
    if (userProfile) {
      loadLocalHistoryFiltered(userProfile.departmentId);
    } else {
      try {
        const localData = JSON.parse(localStorage.getItem('meeting_history') || '[]');
        setArchiveList(localData);
      } catch(e) {
        setArchiveList([]);
      }
    }
  };

  const saveSettings = () => {
    localStorage.setItem('gemini_api_key', geminiKey);
    localStorage.setItem('slack_webhook_url', slackUrl);
    localStorage.setItem('supabase_url', supabaseUrl);
    localStorage.setItem('supabase_anon_key', supabaseKey);
    localStorage.setItem('kakao_javascript_key', kakaoKey);
    localStorage.setItem('is_demo_mode', isDemoMode.toString());
    
    if (window.Kakao && kakaoKey.trim()) {
      try {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(kakaoKey.trim());
        }
      } catch(e) {
        console.warn('Kakao init fail during save:', e);
      }
    }
    
    setSettingsStatus('✅ 설정이 안전하게 저장되었습니다.');
    setTimeout(() => setSettingsStatus(''), 3000);
  };
  const charCount = rawText.length;

  const getLocalDateString = (date = new Date()) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const setPeriodFilter = (months) => {
    const end = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - months);
    
    setEndDate(getLocalDateString(end));
    setStartDate(getLocalDateString(start));
  };

  const resetPeriodFilter = () => {
    setStartDate('');
    setEndDate('');
  };

  const executeAIAnalysis = async () => {
    if (!rawText.trim()) return alert('회의 녹취록 텍스트를 입력해주세요.');
    if (!geminiKey.trim()) return alert('설정 탭에서 Gemini API Key를 확인해주세요.');
    
    setIsAnalyzing(true);
    setProgressText('인공지능 정제 엔진 가동 중...');
    
    const progressMessages = [
      '회의 컨텍스트 요약 구조 분석 중...',
      '부서 간 의존성 및 충돌 가능성 교차 매핑 중...',
      '비즈니스 표준 팩트 요약 레이아웃 작성 중...'
    ];
    
    let msgIndex = 0;
    const interval = setInterval(() => {
      setProgressText(progressMessages[msgIndex]);
      msgIndex = (msgIndex + 1) % progressMessages.length;
    }, 2000);

    try {
      let crossDeptSummaries = [];
      const supabase = getSupabaseClient();
      if (supabase && userProfile) {
        try {
          const { data, error } = await supabase
            .from('meetings')
            .select('title, public_summary, meeting_date, department_id, departments(name)')
            .neq('department_id', userProfile.departmentId)
            .order('created_at', { ascending: false })
            .limit(10);
          if (!error && data) {
            crossDeptSummaries = data.map(m => ({
              title: m.title,
              date: m.meeting_date,
              department: m.departments ? m.departments.name : '타부서',
              summary: m.public_summary || ''
            }));
          }
        } catch(e) {
          console.warn('Cross department summaries load failed:', e);
        }
      }

      const demoCrossSummaries = [
        {
          title: "[개발부] API 서버 성능 튜닝 및 배포 연기 일정 검토",
          date: "2026-06-24",
          department: "개발부",
          summary: "서버 성능 고도화 부하테스트 지연으로 인해 API 서비스 최종 배포 일정이 7월 25일로 조정되었습니다."
        },
        {
          title: "[인프라부] DB 커넥션 풀 누수 원인 분석 및 라이브러리 패치 완료",
          date: "2026-05-10",
          department: "인프라부",
          summary: "PostgreSQL pg-pool 라이브러리 v14.2의 커넥션 누수 버그를 해결하기 위해 v14.5 패치 및 안정화 작업을 완료했습니다."
        },
        {
          title: "[마케팅부] 신제품 출시 및 글로벌 캠페인 개시 일정 수립",
          date: "2026-06-25",
          department: "마케팅부",
          summary: "신제품 출시 글로벌 캠페인 런칭 프로모션 집행일이 7월 18일로 최종 결정되었습니다."
        }
      ];

      const activeCrossSummaries = crossDeptSummaries.length > 0 
        ? crossDeptSummaries 
        : demoCrossSummaries.filter(d => !userProfile || d.department !== userProfile.departmentName);

      const prompt = `
      [역할 정의]
      당신은 대기업 전략기획실 및 대형 회계법인의 15년 차 수석 컨설턴트입니다.
      제공된 [오늘의 회의 녹취록]을 정밀 분석하여, 단순 대화 나열이 아닌 '대기업 임원 보고용 무결성 시너지 리포트'를 작성하세요.
      특히 제공된 [타 부서들의 비식별 공개 요약 목록 (Public Summaries)]을 면밀히 비교하여, 오늘 회의 내용과 상충되는 일정/업무 충돌이 있는지, 혹은 타 부서의 기존 해결책을 통해 시너지를 낼 수 있는 부분이 있는지 함께 분석하세요.

      [출력 형식 제약조건 - 엄격 준수]
      1. 반드시 마크다운 코드블럭(\`\`\`json)이나 특수문자 마크다운(#, *, **, -, \`)을 '절대' 포함하지 말고, 순수한 JSON 객체(JSON Object) 하나만 반환하세요.
      2. 'minutesContent' 내부에는 기호(#, *, -) 대신 순수 텍스트, 숫자(1., 2.), 한글 괄호(가), 나)), 줄바꿈(Enter)만을 사용하세요.
      3. 모든 문장의 어미는 예외 없이 반드시 '~했음.', '~임.', '~됨.', '~판단됨.'과 같은 명사형 어미(대기업 개조식 문체)로 100% 통일하세요.

      [minutesContent 본문 구성 4대 표준 구조]
      본문 텍스트는 반드시 다음 4가지 섹션으로 나누어 작성하세요:

      § 1. 핵심 요약 3줄
      - 회의 전체를 관통하는 핵심 비즈니스 팩트 3가지를 명사형 개조식으로 작성.

      § 2. 전체 회의록 상세 (의제별 고도화)
      - 구어체 대화(예: 누가 ~라고 함)를 절대 금지하고, 회의에서 논의된 주요 '의제(Agenda)'별 단락을 나누어 작성.
      - 각 의제 단락마다 반드시 다음 3가지 요소를 명확히 포함할 것:
        가) 논점 배경: 논의가 발생하게 된 비즈니스/규정/상황적 원인
        나) 상호작용 및 리스크: 발언자 간 교환된 핵심 팩트, 법적/제도적 판단, 잠재적 리스크 및 이슈 우려사항
        다) 결론 및 책임 귀속: 당사자 간 합의된 최종 입장, 책임 소재 및 의사결정 결과
      - 타임라인 및 인과관계가 증명되도록 팩트 밀도를 극대화하여 풍부하게 기술할 것.

      § 3. 투두 리스트 (Action Items)
      - 실행 주체(담당자/부서), 구체적 실행 과제, 완료 목표 기한을 명확히 명시.

      § 4. 팔로업 및 미결 리스트 (Follow-up)
      - 금번 회의에서 결론 내리지 못하고 차기 회의로 이관된 의제 및 추가 검토가 필요한 리스크 항목 기재.

      [JSON 반환 스키마]
      {
        "extractedDate": "회의 내용에서 유추한 실제 회의 날짜 (YYYY-MM-DD 형식. 유추 불가 시 오늘 날짜)",
        "extractedTitle": "회의의 본질을 관통하는 명확하고 격조 높은 비즈니스 회의 제목",
        "aiAttendees": "녹취록에서 추출된 실제 대화 참여자 이름 목록 (쉼표로 구분)",
        "minutesContent": "위의 제약조건과 4대 표준 구조를 100% 준수한 순수 텍스트 회의록 본문",
        "publicSummary": "이 회의록의 보안에 민감한 상세 내용을 제외하고, 타 부서가 공유받았을 때 일정 충돌이나 업무 연계를 검토할 수 있도록 객관적으로 기술한 1~2줄의 비식별화 요약문",
        "actionItems": [
          {
            "task": "행동 조치 사항 구체적 내용",
            "assignee": "담당자 이름 (없으면 미정)",
            "dueDate": "YYYY-MM-DD 기한 (없으면 미정)"
          }
        ],
        "synergyAnalysis": {
          "hasConflict": true/false (일정이나 목표가 상충되면 true),
          "conflictDescription": "상충 내용 상세 기술 (없으면 빈값)",
          "hasSynergy": true/false (타 부서 협업이나 기존 해결책 활용 가능시 true),
          "synergyDescription": "해결책 매핑 및 협업 추천 설명 (없으면 빈값)",
          "targetMeetingTitle": "연관된 과거/타 부서 회의 제목 (없으면 빈값)"
        }
      }

      [타 부서들의 비식별 공개 요약 목록 (Public Summaries)]:
      ${JSON.stringify(activeCrossSummaries)}

      [수동 입력 참석자]: ${attendees}
      [오늘의 회의 녹취록]: ${rawText}
      `;

      // ponytail: try gemini-3.6-flash first, fallback to 3.5 and 2.5 flash
      const modelsToTry = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];
      let resJson = null;
      let lastError = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                responseMimeType: "application/json"
              }
            })
          });

          const data = await response.json();
          if (response.ok && !data.error) {
            resJson = data;
            break;
          } else {
            lastError = data.error?.message || `HTTP ${response.status}`;
          }
        } catch (err) {
          lastError = err.message;
        }
      }

      clearInterval(interval);

      if (!resJson) {
        throw new Error(lastError || 'Gemini API 호출에 실패했습니다.');
      }

      let aiRawOutput = resJson.candidates[0].content.parts[0].text;
      const matched = aiRawOutput.match(/\{[\s\S]*\}/);
      if (matched) aiRawOutput = matched[0];

      const parsedData = JSON.parse(aiRawOutput);
      
      setMeetingTitle(parsedData.extractedTitle || '');
      
      const fallbackDate = getLocalDateString();
      let dateValue = parsedData.extractedDate || '';
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
        dateValue = fallbackDate;
      }
      setMeetingDate(dateValue);
      setRefinedContent(parsedData.minutesContent || '');
      setPublicSummary(parsedData.publicSummary || '');
      setExtractedAttendees(parsedData.aiAttendees || '');
      setActionItems(parsedData.actionItems || []);
      setSynergyAnalysis(parsedData.synergyAnalysis || null);

    } catch (e) {
      alert('AI 분석 중 오류가 발생했습니다: ' + e.message);
    } finally {
      setIsAnalyzing(false);
      clearInterval(interval);
    }
  };

  const saveToDatabase = async () => {
    if (!refinedContent.trim()) return alert('보관할 회의록 내용이 없습니다.');
    if (isSaving) return;
    setIsSaving(true);
    setSaveStatus('⏳ 저장 중...');

    try {
      const supabase = getSupabaseClient();
      let insertedMeeting = null;
      let dbError = null;

      const validDate = (meetingDate && meetingDate.trim()) ? meetingDate.trim() : new Date().toISOString().split('T')[0];
      const validTitle = (meetingTitle && meetingTitle.trim()) ? meetingTitle.trim() : '무제 회의';

      if (supabase && user && user.id !== 'demo-user') {
        try {
          // meetings 테이블 컬럼에 맞춘 Payload (존재하지 않는 action_items 컬럼 제외)
          const insertPayload = {
            title: validTitle,
            meeting_date: validDate,
            raw_text: rawText || '',
            refined_content: refinedContent,
            public_summary: publicSummary || '',
            ai_attendees: extractedAttendees || '',
            author_id: user.id,
            department_id: userProfile ? userProfile.departmentId : null
          };

          const { data, error } = await supabase.from('meetings').insert([insertPayload]).select();
          if (error) throw error;
          if (data && data[0]) {
            insertedMeeting = data[0];
          }
        } catch (e) {
          console.error('Supabase DB 저장 실패:', e);
          dbError = e.message || 'Cloud DB 저장 중 오류가 발생했습니다.';
        }
      }

      const newRecord = {
        id: insertedMeeting ? insertedMeeting.id : Date.now().toString(),
        title: validTitle,
        date: validDate,
        attendees: extractedAttendees || attendees || '미정',
        content: refinedContent,
        publicSummary: publicSummary || '',
        actionItems: actionItems || [],
        synergyAnalysis: synergyAnalysis,
        departmentId: userProfile ? userProfile.departmentId : '1',
        departmentName: userProfile ? userProfile.departmentName : '개발부',
        url: '#'
      };

      // 로컬 스토리지 보관 및 아카이브 갱신
      try {
        const localData = JSON.parse(localStorage.getItem('meeting_history') || '[]');
        const updated = [newRecord, ...localData.filter(item => item.id !== newRecord.id)];
        localStorage.setItem('meeting_history', JSON.stringify(updated));
      } catch(e) {
        console.warn('LocalStorage save failed:', e);
      }
      
      if (insertedMeeting && supabase && user && user.id !== 'demo-user') {
        await loadMeetingsList(supabase, userProfile ? userProfile.departmentId : null);
      } else {
        setArchiveList(prev => [newRecord, ...prev.filter(item => item.id !== newRecord.id)]);
      }
      
      if (dbError) {
        setSaveStatus(`⚠️ 로컬 저장됨 (DB 오류: ${dbError})`);
      } else if (user && user.id !== 'demo-user') {
        setSaveStatus('✅ Cloud DB & 로컬 저장 완료!');
      } else {
        setSaveStatus('✅ 로컬 보관소 저장 완료 (데모 모드)');
      }
    } catch (e) {
      console.error('saveToDatabase error:', e);
      setSaveStatus('❌ 저장 실패: ' + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const sendSlack = async () => {
    if (!slackUrl) return alert('설정 탭에서 Slack Webhook URL을 등록해주세요.');
    setSlackStatus('⏳ 전송 중...');

    const blocks = [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": `📝 [회의록 알림] ${meetingTitle}`,
          "emoji": true
        }
      },
      {
        "type": "section",
        "fields": [
          { "type": "mrkdwn", "text": `*회의일시:* ${meetingDate}` },
          { "type": "mrkdwn", "text": `*참석자:* ${extractedAttendees || attendees}` }
        ]
      },
      { "type": "divider" }
    ];

    const summaryText = refinedContent.length > 400 ? refinedContent.substring(0, 400) + '...' : refinedContent;
    blocks.push({
      "type": "section",
      "text": { "type": "mrkdwn", "text": `*회의 요약:*\n${summaryText}` }
    });

    if (actionItems.length > 0) {
      blocks.push({ "type": "divider" });
      blocks.push({
        "type": "section",
        "text": { "type": "mrkdwn", "text": "*🔥 주요 Action Items*" }
      });
      actionItems.forEach(item => {
        blocks.push({
          "type": "section",
          "text": { "type": "mrkdwn", "text": `• *${item.task}* (담당: \`${item.assignee}\` / 기한: \`${item.dueDate}\`)` }
        });
      });
    }

    if (synergyAnalysis && (synergyAnalysis.hasConflict || synergyAnalysis.hasSynergy)) {
      blocks.push({ "type": "divider" });
      blocks.push({
        "type": "section",
        "text": { "type": "mrkdwn", "text": "*⚠️ AI 부서 간 교차 분석 경고/시너지*" }
      });
      if (synergyAnalysis.hasConflict) {
        blocks.push({
          "type": "section",
          "text": { "type": "mrkdwn", "text": `🚨 *일정/협업 충돌:* ${synergyAnalysis.conflictDescription}\n_(연관 회의: ${synergyAnalysis.targetMeetingTitle})_` }
        });
      }
      if (synergyAnalysis.hasSynergy) {
        blocks.push({
          "type": "section",
          "text": { "type": "mrkdwn", "text": `💡 *부서 협업/솔루션 추천:* ${synergyAnalysis.synergyDescription}\n_(연관 회의: ${synergyAnalysis.targetMeetingTitle})_` }
        });
      }
    }

    try {
      await fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: JSON.stringify({ blocks })
      });
      setSlackStatus('📢 Slack 공유 완료!');
    } catch(e) {
      setSlackStatus('📢 Slack 공유 전송 완료 (Mock)');
    }
  };

  const sendEmail = () => {
    if (!emailRecipient) { alert('수신 이메일 주소를 입력해주세요.'); return; }
    if (!refinedContent.trim()) { alert('공유할 회의록 내용이 없습니다.'); return; }

    const subject = encodeURIComponent(`[회의록] ${meetingTitle} (${meetingDate})`);
    const actionText = actionItems.length > 0
      ? '\n\n== 핵심 Action Items ==\n' + actionItems.map(i => `• ${i.task} (담당: ${i.assignee} / 기한: ${i.dueDate})`).join('\n')
      : '';
    const synergyText = synergyAnalysis && synergyAnalysis.hasSynergy
      ? `\n\n== AI 부서 시너지 ==\n💡 ${synergyAnalysis.synergyDescription}`
      : '';
    const body = encodeURIComponent(
      `안녕하세요,\n\n${meetingTitle} 회의록을 공유합니다.\n\n== 회의 요약 ==\n${refinedContent}${actionText}${synergyText}\n\n---\nMeeting Note AI 플랫폼에서 자동 발송`
    );

    window.location.href = `mailto:${emailRecipient}?subject=${subject}&body=${body}`;
    setEmailStatus('📧 이메일 클라이언트 열림 완료!');
  };

  const sendKakao = () => {
    if (!refinedContent.trim()) return alert('공유할 회의록 내용이 없습니다.');
    
    const truncatedContent = refinedContent.length > 200 ? refinedContent.substring(0, 200) + '...' : refinedContent;
    const actionItemsText = actionItems.slice(0, 3).map(item => `• ${item.task} (담당: ${item.assignee})`).join('\n');
    
    const shareText = `📝 [Meeting Note] ${meetingTitle}\n` +
      `🗓️ 일시: ${meetingDate}\n` +
      `👥 참석자: ${extractedAttendees || attendees || '미정'}\n\n` +
      `📌 주요 요약:\n${truncatedContent}\n\n` +
      (actionItemsText ? `🔥 핵심 Action Items:\n${actionItemsText}\n\n` : '') +
      (synergyAnalysis && synergyAnalysis.hasSynergy ? `💡 AI 시너지: ${synergyAnalysis.synergyDescription}\n` : '') +
      `▶ 플랫폼 확인: ${window.location.href}`;
      
    navigator.clipboard.writeText(shareText);
    
    const kakaoKeySaved = localStorage.getItem('kakao_javascript_key');
    if (window.Kakao && kakaoKeySaved) {
      try {
        if (!window.Kakao.isInitialized()) {
          window.Kakao.init(kakaoKeySaved);
        }
        
        window.Kakao.Share.sendDefault({
          objectType: 'feed',
          content: {
            title: `📝 [Meeting Note] ${meetingTitle}`,
            description: refinedContent.substring(0, 60) + '...',
            imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=300&auto=format&fit=crop',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
          buttons: [
            {
              title: '회의록 확인하기',
              link: {
                mobileWebUrl: window.location.href,
                webUrl: window.location.href,
              },
            },
          ],
        });
        return;
      } catch (err) {
        console.error('Kakao SDK 공유 에러:', err);
      }
    }
    
    alert('📢 카카오톡 공유 포맷이 클립보드에 복사되었습니다!\n원하는 채팅방에 붙여넣기(Ctrl+V) 하세요.');
    window.open('https://sharer.kakao.com/talk/friends/picker/link?url=' + encodeURIComponent(window.location.href), '_blank');
  };

  const deleteRecord = async (id) => {
    if (!confirm('정말 이 회의록 데이터를 영구 삭제하시겠습니까?')) return;
    
    const supabase = getSupabaseClient();
    if (supabase && user && user.id !== 'demo-user') {
      try {
        const { error } = await supabase
          .from('meetings')
          .delete()
          .eq('id', id);
        if (error) throw error;
      } catch (e) {
        console.warn('Supabase DB delete failed:', e);
        alert('DB 삭제 실패: ' + e.message);
        return;
      }
    }
    
    try {
      const localData = JSON.parse(localStorage.getItem('meeting_history') || '[]');
      const updatedLocal = localData.filter(item => item.id !== id);
      localStorage.setItem('meeting_history', JSON.stringify(updatedLocal));
    } catch(e) {
      console.warn('LocalStorage delete failed:', e);
    }

    const updated = archiveList.filter(item => item.id !== id);
    setArchiveList(updated);
    if (selectedMeeting && selectedMeeting.id === id) {
      setSelectedMeeting(null);
    }
  };

  // 아카이브 데이터 기반 동적 차트 포인트 생성
  const getChartData = () => {
    const last5 = [...archiveList].slice(0, 5).reverse();
    
    const defaultData = [
      { title: '기본1', synergy: 35, risk: 8 },
      { title: '기본2', synergy: 50, risk: 4 },
      { title: '기본3', synergy: 42, risk: 10 },
      { title: '기본4', synergy: 68, risk: 3 },
      { title: '기본5', synergy: 85, risk: 2 }
    ];
    
    if (last5.length === 0) {
      return defaultData;
    }
    
    // 데이터가 5개 미만인 경우 앞부분을 기본값으로 채움
    const paddedList = [];
    const missingCount = 5 - last5.length;
    for (let i = 0; i < missingCount; i++) {
      paddedList.push(defaultData[i]);
    }
    
    last5.forEach((item, index) => {
      let synergyScore = 35;
      let riskScore = 5;
      
      if (item.synergyAnalysis) {
        synergyScore += item.synergyAnalysis.hasSynergy ? 35 : 5;
        riskScore += item.synergyAnalysis.hasConflict ? 15 : -3;
      } else {
        synergyScore += (index * 8) + 12;
        riskScore += (index % 2 === 0 ? 3 : 1);
      }
      
      synergyScore = Math.max(15, Math.min(100, synergyScore));
      riskScore = Math.max(2, Math.min(45, riskScore)); // 리스크는 낮고 시너지 위주
      
      paddedList.push({
        title: item.title,
        synergy: synergyScore,
        risk: riskScore
      });
    });
    
    return paddedList;
  };

  const chartPoints = getChartData();

  const buildPath = (key) => {
    const coords = chartPoints.map((pt, idx) => {
      const x = 20 + idx * 115;
      const score = pt[key];
      const y = 110 - (score / 100) * 90;
      return { x, y };
    });
    
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i-1];
      const curr = coords[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` Q ${prev.x} ${prev.y}, ${cx} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
    }
    return d;
  };

  const buildAreaPath = (key) => {
    const coords = chartPoints.map((pt, idx) => {
      const x = 20 + idx * 115;
      const score = pt[key];
      const y = 110 - (score / 100) * 90;
      return { x, y };
    });
    
    let d = `M ${coords[0].x} ${coords[0].y}`;
    for (let i = 1; i < coords.length; i++) {
      const prev = coords[i-1];
      const curr = coords[i];
      const cx = (prev.x + curr.x) / 2;
      d += ` Q ${prev.x} ${prev.y}, ${cx} ${(prev.y + curr.y) / 2} T ${curr.x} ${curr.y}`;
    }
    
    const last = coords[coords.length - 1];
    d += ` L ${last.x} 120 L ${coords[0].x} 120 Z`;
    return d;
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-mesh-gradient-light text-zinc-800 flex flex-col items-center justify-center font-sans px-4 py-12 selection:bg-rose-500 selection:text-white">
        <div className="double-bezel-shell-light aurora-shadow-rose p-1 rounded-[2.5rem] w-full max-w-md animate-fade-up">
          <div className="double-bezel-core-light p-8 rounded-[calc(2.5rem-0.25rem)] space-y-6 text-center">
            
            {/* Logo */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-rose-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-rose-250">
                <Sparkles className="h-6 w-6 text-white animate-pulse" />
              </div>
              <span className="font-display font-black text-lg tracking-widest bg-gradient-to-r from-zinc-800 via-rose-500 to-indigo-600 bg-clip-text text-transparent mt-2">MEETING NOTE</span>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">AI Meeting Analysis & Synergy Innovation</p>
            </div>

            <div className="border-b border-zinc-100 my-4"></div>

            <h3 className="text-sm font-bold text-zinc-800">
              {authMode === 'login' ? '스마트 협업 플랫폼 로그인' : '새로운 미팅노트 계정 생성'}
            </h3>

            <form onSubmit={authMode === 'login' ? handleSignIn : handleSignUp} className="space-y-4 text-left">
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">이메일 주소</span>
                <input 
                  type="email" 
                  required
                  value={authEmail}
                  onChange={(e) => { setAuthEmail(e.target.value); setAuthError(''); }}
                  placeholder="name@company.com" 
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">비밀번호 {authMode === 'signup' && <span className="text-zinc-300 normal-case">(6자 이상)</span>}</span>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={authPassword}
                  onChange={(e) => { setAuthPassword(e.target.value); setAuthError(''); }}
                  placeholder="••••••••" 
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium"
                />
              </div>

              {authMode === 'signup' && (
                <>
                  <div className="flex flex-col gap-1.5 animate-fade-up">
                    <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">이름 (실명)</span>
                    <input 
                      type="text" 
                      required
                      value={onboardingName}
                      onChange={(e) => { setOnboardingName(e.target.value); setAuthError(''); }}
                      placeholder="홍길동" 
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 animate-fade-up">
                    <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">소속 부서</span>
                    <select 
                      required
                      value={onboardingDept}
                      onChange={(e) => { setOnboardingDept(e.target.value); setCustomDeptName(''); setAuthError(''); }}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-700 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium"
                    >
                      <option value="">부서 선택</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                      <option value="etc">기타 (직접입력)</option>
                    </select>
                  </div>

                  {onboardingDept === 'etc' && (
                    <div className="flex flex-col gap-1.5 animate-fade-up">
                      <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">부서명 직접 입력</span>
                      <input 
                        type="text" 
                        required
                        value={customDeptName}
                        onChange={(e) => { setCustomDeptName(e.target.value); setAuthError(''); }}
                        placeholder="부서명을 입력하세요" 
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium"
                      />
                    </div>
                  )}
                </>
              )}

              {authError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-semibold px-3 py-2 rounded-xl">
                  ⚠️ {authError}
                </div>
              )}

              <button 
                type="submit"
                disabled={authLoading}
                className="w-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-750 text-white font-black py-3 rounded-full text-xs transition-premium active:scale-[0.98] cursor-pointer text-center disabled:opacity-60"
              >
                {authLoading ? '처리 중...' : (authMode === 'login' ? '로그인 완료' : '회원가입 완료')}
              </button>
            </form>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-zinc-100"></div>
              <span className="flex-shrink mx-4 text-[9px] text-zinc-400 font-bold uppercase tracking-wider">또는</span>
              <div className="flex-grow border-t border-zinc-100"></div>
            </div>

            <button 
              onClick={handleGoogleSignIn}
              className="w-full bg-white border border-zinc-200 text-zinc-700 font-bold py-3 rounded-full text-xs hover:bg-zinc-50 transition-premium flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google 계정으로 로그인
            </button>

            <div className="text-xs text-zinc-500 pt-2 flex flex-col gap-2">
              {authMode === 'login' ? (
                <p>계정이 없으신가요? <button onClick={() => { setAuthMode('signup'); setAuthError(''); setOnboardingName(''); setOnboardingDept(''); setCustomDeptName(''); }} className="text-rose-500 font-bold hover:underline">회원가입하기</button></p>
              ) : (
                <p>이미 계정이 있으신가요? <button onClick={() => { setAuthMode('login'); setAuthError(''); }} className="text-rose-500 font-bold hover:underline">로그인하기</button></p>
              )}
            </div>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh-gradient-light text-zinc-800 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      
      {/* Floating Glass Pill Navigation Bar (Light Theme) */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4">
        <div className="glass-panel-light max-w-3xl mx-auto mt-6 px-6 py-2.5 rounded-full flex items-center justify-between shadow-lg shadow-zinc-200/50">
          <div className="flex items-center gap-2 shrink-0">
            <Sparkles className="h-4 w-4 text-rose-500 animate-pulse" />
            <span className="font-display font-black text-xs tracking-wider bg-gradient-to-r from-zinc-800 via-rose-500 to-indigo-600 bg-clip-text text-transparent">MEETING NOTE</span>
          </div>
          
          <div className="flex items-center gap-4">
            <nav className="flex gap-1">
              <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-premium-fast ${activeTab === 'analytics' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                분석 엔진
              </button>
              <button 
                onClick={() => setActiveTab('idea-bank')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-premium-fast ${activeTab === 'idea-bank' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                아이디어 뱅크
              </button>
              <button 
                onClick={() => setActiveTab('archive')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-premium-fast ${activeTab === 'archive' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                아카이브
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-premium-fast ${activeTab === 'settings' ? 'bg-zinc-800 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-800'}`}
              >
                설정
              </button>
            </nav>

            <div className="border-l border-zinc-200 h-5"></div>

            {/* User Profile Bar */}
            {userProfile && (
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-600 border border-rose-500/10 px-2 py-0.5 rounded-md">
                  {userProfile.departmentName}
                </span>
                <span className="text-[10px] font-bold text-zinc-700 truncate max-w-[80px]">
                  {userProfile.fullName}님
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-[9px] text-zinc-400 hover:text-rose-500 font-bold transition-premium-fast cursor-pointer"
                >
                  로그아웃
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Spacer for Floating Nav */}
      <div className="h-28"></div>

      {/* Main Container (Full-width Single Column Stack / max-w-3xl) */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 space-y-16">
        
        {/* CREATE TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-12 animate-fade-up">
            
            {/* Page Header (Luminescent Minimal Style) */}
            <div className="text-center space-y-4">
              <span className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-black text-rose-500 bg-rose-500/5 border border-rose-500/10 inline-block">
                Luminescent Clean Suite
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight text-zinc-900 leading-[1.3] pb-1">
                회의를 잇다, 시너지를 열다<br/>
                <span className="bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 bg-clip-text text-transparent">AI 회의 분석 · 실시간 연계 플랫폼</span>
              </h2>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">전사 지식 연계, 투두 매핑 및 모순된 일정을 실시간으로 감지합니다.</p>
            </div>

            {/* [최상단 배치] Organic 3D Department Synergy Network Map */}
            <div className="double-bezel-shell-light aurora-shadow-rose p-1 rounded-[2.5rem]">
              <div className="double-bezel-core-light p-6 rounded-[calc(2.5rem-0.25rem)] space-y-4 text-left">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <TrendingUp className="h-4 w-4 text-rose-500 animate-pulse" /> AI Cross-Team Synergy Mindmap
                  </h4>
                  <span className="text-[9px] bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2.5 py-0.5 rounded-full font-black animate-pulse">
                    Interactive Grid Map
                  </span>
                </div>
                
                {/* 2D Obsidian-style Category Mindmap Graph Container */}
                <div 
                  className="w-full relative h-[380px] bg-zinc-50/50 bg-[radial-gradient(#e4e4e7_1.2px,transparent_1.2px)] [background-size:16px_16px] border border-zinc-200/80 rounded-3xl overflow-hidden shadow-sm select-none"
                  onMouseMove={(e) => {
                    if (!draggedNodeId) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clientX = e.clientX;
                    const clientY = e.clientY;
                    const x = ((clientX - rect.left) / rect.width) * 500;
                    const y = ((clientY - rect.top) / rect.height) * 380;
                    setNodePositions(prev => ({
                      ...prev,
                      [draggedNodeId]: {
                        x: Math.max(20, Math.min(480, x - dragOffset.x)),
                        y: Math.max(20, Math.min(360, y - dragOffset.y))
                      }
                    }));
                  }}
                  onMouseUp={() => setDraggedNodeId(null)}
                  onMouseLeave={() => setDraggedNodeId(null)}
                  onTouchMove={(e) => {
                    if (!draggedNodeId || !e.touches[0]) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clientX = e.touches[0].clientX;
                    const clientY = e.touches[0].clientY;
                    const x = ((clientX - rect.left) / rect.width) * 500;
                    const y = ((clientY - rect.top) / rect.height) * 380;
                    setNodePositions(prev => ({
                      ...prev,
                      [draggedNodeId]: {
                        x: Math.max(20, Math.min(480, x - dragOffset.x)),
                        y: Math.max(20, Math.min(360, y - dragOffset.y))
                      }
                    }));
                  }}
                  onTouchEnd={() => setDraggedNodeId(null)}
                >
                  {/* SVG 100% Canvas */}
                  <svg className="w-full h-full" viewBox="0 0 500 380">
                    <defs>
                      <linearGradient id="obsidian-parent-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>

                    {/* 1. 연결선 (Edges) 렌더링 */}
                    {/* A. 기획부 <-> 부서 간 메인 굵은 실선 */}
                    {networkData.orbitals.map((orb) => {
                      const parentPos = nodePositions.parent || { x: 250, y: 190 };
                      const pos = nodePositions[orb.id] || { x: 250, y: 190 };
                      const isHovered = hoveredNode === orb.id || hoveredNode === 'parent';

                      return (
                        <line
                          key={`main-edge-${orb.id}`}
                          x1={parentPos.x}
                          y1={parentPos.y}
                          x2={pos.x}
                          y2={pos.y}
                          stroke={isHovered ? "#6366f1" : "#cbd5e1"}
                          strokeWidth={isHovered ? 2.0 : 1.2}
                          strokeOpacity={isHovered ? 1.0 : 0.6}
                          style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                        />
                      );
                    })}

                    {/* B. 부서 <-> 개별 아이디어 간 얇은 점선 가지치기 */}
                    {ideas.map((idea, idx) => {
                      const id = `idea-${idea.id || idx}`;
                      let toDept = 'dev';
                      if (idea.authorDept === '마케팅팀') toDept = 'mkt';
                      else if (idea.authorDept === '디자인팀') toDept = 'design';

                      const deptPos = nodePositions[toDept] || { x: 250, y: 190 };
                      const pos = nodePositions[id] || { x: 250, y: 190 };
                      const isHovered = hoveredNode === id || hoveredNode === toDept;

                      return (
                        <line
                          key={`leaf-edge-${id}`}
                          x1={deptPos.x}
                          y1={deptPos.y}
                          x2={pos.x}
                          y2={pos.y}
                          stroke={isHovered ? "#4f46e5" : "#94a3b8"}
                          strokeWidth={isHovered ? 1.5 : 0.8}
                          strokeOpacity={isHovered ? 0.9 : 0.35}
                          strokeDasharray="3, 3"
                          style={{ transition: "stroke 0.3s ease, stroke-width 0.3s ease" }}
                        />
                      );
                    })}

                    {/* 2. 중앙 기획부 노드 (지름 16px) */}
                    {(() => {
                      const pos = nodePositions.parent || { x: 250, y: 190 };

                      return (
                        <g 
                          transform={`translate(${pos.x}, ${pos.y})`}
                          className="cursor-grab active:cursor-grabbing group"
                          onMouseDown={(e) => {
                            const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 500;
                            const y = ((e.clientY - rect.top) / rect.height) * 380;
                            setDraggedNodeId('parent');
                            setDragOffset({ x: x - pos.x, y: y - pos.y });
                          }}
                          onTouchStart={(e) => {
                            if (e.touches[0]) {
                              const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                              const x = ((e.touches[0].clientX - rect.left) / rect.width) * 500;
                              const y = ((e.touches[0].clientY - rect.top) / rect.height) * 380;
                              setDraggedNodeId('parent');
                              setDragOffset({ x: x - pos.x, y: y - pos.y });
                            }
                          }}
                          onMouseEnter={() => setHoveredNode('parent')}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <circle r="12" className="fill-purple-100 stroke-purple-500 stroke-2 transition-all duration-300 group-hover:scale-110" />
                          <circle r="8" fill="url(#obsidian-parent-grad)" />
                          <text 
                            x="0" 
                            y="25" 
                            textAnchor="middle" 
                            className="text-[9px] font-black fill-zinc-800 tracking-wider transition-all duration-300 group-hover:fill-purple-600"
                          >
                            기획부
                          </text>
                        </g>
                      );
                    })()}

                    {networkData.orbitals.map((orb) => {
                      const pos = nodePositions[orb.id] || { x: 250, y: 190 };

                      let nodeColor = "fill-indigo-500";
                      let strokeColor = "stroke-indigo-200";
                      if (orb.id === "mkt") {
                        nodeColor = "fill-rose-500";
                        strokeColor = "stroke-rose-200";
                      } else if (orb.id === "design") {
                        nodeColor = "fill-emerald-500";
                        strokeColor = "stroke-emerald-200";
                      }

                      return (
                        <g
                          key={`dept-node-${orb.id}`}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          className="cursor-grab active:cursor-grabbing group"
                          onMouseDown={(e) => {
                            const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 500;
                            const y = ((e.clientY - rect.top) / rect.height) * 380;
                            setDraggedNodeId(orb.id);
                            setDragOffset({ x: x - pos.x, y: y - pos.y });
                          }}
                          onTouchStart={(e) => {
                            if (e.touches[0]) {
                              const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                              const x = ((e.touches[0].clientX - rect.left) / rect.width) * 500;
                              const y = ((e.touches[0].clientY - rect.top) / rect.height) * 380;
                              setDraggedNodeId(orb.id);
                              setDragOffset({ x: x - pos.x, y: y - pos.y });
                            }
                          }}
                          onMouseEnter={() => setHoveredNode(orb.id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <circle r="9" className={`${strokeColor} fill-white stroke-2 transition-all duration-300 group-hover:scale-110`} />
                          <circle r="6" className={nodeColor} />
                          <text 
                            x="0" 
                            y="-14" 
                            textAnchor="middle" 
                            className="text-[8px] font-extrabold fill-zinc-700 tracking-tight transition-all duration-300 group-hover:fill-zinc-900 group-hover:scale-105"
                          >
                            {orb.name}
                          </text>
                        </g>
                      );
                    })}

                    {/* 4. 개별 아이디어 리프 노드 렌더링 (지름 7px) */}
                    {ideas.map((idea, idx) => {
                      const id = `idea-${idea.id || idx}`;
                      const pos = nodePositions[id] || { x: 250, y: 190 };
                      const isHovered = hoveredNode === id;

                      let leafColor = "fill-indigo-400";
                      if (idea.authorDept === '마케팅팀') leafColor = "fill-rose-400";
                      else if (idea.authorDept === '디자인팀') leafColor = "fill-emerald-400";

                      return (
                        <g
                          key={`leaf-node-${id}`}
                          transform={`translate(${pos.x}, ${pos.y})`}
                          className="cursor-grab active:cursor-grabbing group"
                          onMouseDown={(e) => {
                            const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                            const x = ((e.clientX - rect.left) / rect.width) * 500;
                            const y = ((e.clientY - rect.top) / rect.height) * 380;
                            setDraggedNodeId(id);
                            setDragOffset({ x: x - pos.x, y: y - pos.y });
                          }}
                          onTouchStart={(e) => {
                            if (e.touches[0]) {
                              const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect();
                              const x = ((e.touches[0].clientX - rect.left) / rect.width) * 500;
                              const y = ((e.touches[0].clientY - rect.top) / rect.height) * 380;
                              setDraggedNodeId(id);
                              setDragOffset({ x: x - pos.x, y: y - pos.y });
                            }
                          }}
                          onMouseEnter={() => setHoveredNode(id)}
                          onMouseLeave={() => setHoveredNode(null)}
                        >
                          <circle r="6" className="fill-white stroke-zinc-300 stroke-1 opacity-70 group-hover:scale-125 transition-all duration-300" />
                          <circle r="3.5" className={`${leafColor} transition-all duration-300`} />
                          
                          {/* 옵시디언 스타일 크리스피 라벨 표시 */}
                          <text 
                            x="8" 
                            y="2.5" 
                            className={`text-[6.5px] font-semibold tracking-tight transition-all duration-300 ${isHovered ? 'fill-zinc-900 font-black scale-105' : 'fill-zinc-400'}`}
                          >
                            {idea.title.length > 10 ? idea.title.substring(0, 10) + '...' : idea.title}
                          </text>

                          {/* 호버 시 전체 정보 표시용 툴팁 뱃지 */}
                          {isHovered && (
                            <foreignObject
                              x="-50"
                              y="-35"
                              width="100"
                              height="24"
                              className="pointer-events-none"
                            >
                              <div className="bg-zinc-900/90 text-white text-[5px] leading-tight p-1 rounded shadow-md text-center backdrop-blur-xs">
                                {idea.title}
                              </div>
                            </foreignObject>
                          )}
                        </g>
                      );
                    })}
                  </svg>

                  {/* Empty State Contextual Micro-Copy */}
                  {ideas.length === 0 && (
                    <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md border border-zinc-200 px-4 py-2.5 rounded-2xl text-[8px] font-black text-rose-500 text-center tracking-wider shadow-sm animate-pulse">
                      ⚡ 아카이브에서 미팅 로그를 결합하거나 단독 아이디어를 발제하여 전사 시너지 맵을 활성화하세요.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* [1단계] 예정 참석자 (가로 100%) */}
            <div className="double-bezel-shell-light aurora-shadow-teal p-1 rounded-[2rem] step-connection-line">
              <div className="double-bezel-core-light p-5 rounded-[calc(2rem-0.25rem)] space-y-3 text-left">
                <span className="text-[9px] bg-rose-500/10 text-rose-500 border border-rose-500/10 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                  STEP 01
                </span>
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mt-1">
                  <User className="h-4 w-4 text-rose-500" /> 예정 참석자 명단 등록
                </h3>
                <input 
                  type="text" 
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="예: 이다은, 이시은 (쉼표로 구분)" 
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium"
                />
              </div>
            </div>

            {/* [2단계] 녹취록 입력 & 분석 (가로 100%) */}
            <div className="double-bezel-shell-light aurora-shadow-indigo p-1 rounded-[2rem] step-connection-line">
              <div className="double-bezel-core-light p-5 rounded-[calc(2rem-0.25rem)] space-y-4 text-left">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] bg-indigo-500/10 text-indigo-600 border border-indigo-500/10 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                      STEP 02
                    </span>
                    <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mt-2">
                      <Layers className="h-4 w-4 text-indigo-500" /> 회의 속기 데이터 투입
                    </h3>
                  </div>
                  <span className="text-[9px] bg-zinc-100 text-zinc-500 px-2.5 py-0.5 rounded-full font-bold">{charCount.toLocaleString()} 자 입력</span>
                </div>
                <textarea 
                  rows={6}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="녹음 파일에서 텍스트로 변환되었거나, 회의 중 속기한 내용을 이곳에 붙여넣으세요..."
                  className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3.5 text-xs text-zinc-800 placeholder-zinc-400 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium resize-none"
                />
                
                {/* Button-in-Button CTA (밝은 테마 톤업) */}
                <button 
                  onClick={executeAIAnalysis}
                  disabled={isAnalyzing}
                  className="group relative w-full bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-750 text-white font-black py-3 px-5 rounded-full text-xs flex justify-between items-center transition-premium active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                >
                  <span>{isAnalyzing ? '회의록 컨텍스트 분석 중...' : '인공지능 분석 아키텍처 가동'}</span>
                  <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center transition-premium group-hover:translate-x-1 group-hover:scale-105">
                    <Play className="h-3 w-3 fill-current text-white" />
                  </span>
                </button>

                {isAnalyzing && (
                  <div className="space-y-2 mt-2">
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-400 via-purple-500 to-indigo-500 h-full animate-progress" style={{ width: '100%' }}></div>
                    </div>
                    <p className="text-[9px] text-center text-zinc-500 font-semibold">{progressText}</p>
                  </div>
                )}
              </div>
            </div>

            {/* [3단계] AI 원장 데이터 검증 (가로 100%) */}
            {(meetingTitle || refinedContent) && (
              <div className="double-bezel-shell-light aurora-shadow-teal p-1 rounded-[2.5rem] step-connection-line animate-fade-up">
                <div className="double-bezel-core-light p-6 md:p-8 rounded-[calc(2.5rem-0.375rem)] space-y-6 text-left">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-100 pb-4 gap-3">
                    <div>
                      <span className="text-[9px] bg-rose-500/10 text-rose-500 border border-rose-500/10 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                        STEP 03
                      </span>
                      <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mt-2">
                        <Sparkles className="h-4 w-4 text-rose-500" /> AI 스마트 회의 원장 검증
                      </h3>
                    </div>
                    {extractedAttendees && (
                      <span className="bg-rose-50 border border-rose-100 text-rose-600 text-[9px] font-black px-3 py-1 rounded-full">
                        🔊 추출 참석자: {extractedAttendees}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">추출된 회의 제목</span>
                      <input 
                        type="text" 
                        value={meetingTitle}
                        onChange={(e) => setMeetingTitle(e.target.value)}
                        className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs font-bold text-zinc-800 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">유추된 회의 일자</span>
                      <input 
                        type="date" 
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-700 focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center pr-1">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">회의록 본문 (개조식)</span>
                      {refinedContent && (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(refinedContent);
                            alert('클립보드에 복사 완료!');
                          }}
                          className="text-[10px] text-rose-500 hover:text-rose-600 font-bold flex items-center gap-1 transition-premium-fast"
                        >
                          <Copy className="h-3 w-3" /> 복사하기
                        </button>
                      )}
                    </div>
                    <textarea 
                      rows={12}
                      value={refinedContent}
                      onChange={(e) => setRefinedContent(e.target.value)}
                      className="bg-zinc-50 border border-zinc-100 rounded-xl p-4 text-xs text-zinc-700 leading-[1.8] focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-premium font-mono resize-none"
                    />
                  </div>

                  {/* AI Cross-team Synergy Alert Banner (Light) - 회의록 본문 하단으로 이동 */}
                  {synergyAnalysis && (synergyAnalysis.hasConflict || synergyAnalysis.hasSynergy) && (
                    <div className="bg-gradient-to-br from-zinc-50/50 to-white border border-rose-100/50 rounded-2xl p-5 space-y-4 shadow-sm animate-fade-up">
                      <h4 className="text-[10px] font-black text-rose-500 flex items-center gap-1.5 uppercase tracking-wider">
                        <TrendingUp className="h-4 w-4" /> AI 교차 부서 시너지 및 일정 리스크 보고서
                      </h4>
                      
                      {synergyAnalysis.hasConflict && (
                        <div className="flex gap-3 items-start text-xs bg-rose-50/30 border border-rose-200/50 p-4 rounded-xl">
                          <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-rose-600">일정 및 협업 충돌 경고:</span>
                            <p className="text-zinc-600 mt-1 text-[11px] leading-[1.8]">{synergyAnalysis.conflictDescription}</p>
                            <p className="text-zinc-400 text-[10px] mt-2 font-bold">📍 연관 회의: {synergyAnalysis.targetMeetingTitle}</p>
                          </div>
                        </div>
                      )}
                      
                      {synergyAnalysis.hasSynergy && (
                        <div className="flex gap-3 items-start text-xs bg-teal-50/20 border border-teal-200/40 p-4 rounded-xl">
                          <Info className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-teal-700">타 부서 기술/업무 해결책 매핑 시너지:</span>
                            <p className="text-zinc-600 mt-1 text-[11px] leading-[1.8]">{synergyAnalysis.synergyDescription}</p>
                            <p className="text-zinc-400 text-[10px] mt-2 font-bold">📍 연관 회의: {synergyAnalysis.targetMeetingTitle}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Action Items List */}
                  {actionItems.length > 0 && (
                    <div className="border-t border-zinc-100 pt-5 space-y-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckSquare className="h-4 w-4 text-rose-500" /> 핵심 Action Items
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {actionItems.map((item, idx) => (
                          <div key={idx} className="p-3.5 bg-zinc-50/50 border border-zinc-100 rounded-xl flex flex-col justify-between hover:border-rose-500/20 transition-premium-fast">
                            <span className="text-xs font-bold text-zinc-800">{item.task}</span>
                            <div className="flex justify-between items-center mt-2 text-[10px] font-semibold text-zinc-400">
                              <span>👤 {item.assignee}</span>
                              <span className="flex items-center gap-1 text-zinc-500"><Clock className="h-3 w-3" /> {item.dueDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* [4단계 배치] 3단 공유 및 배포 카드 (가로형 그리드) */}
            <div className="space-y-4">
              <div className="text-left">
                <span className="text-[9px] bg-teal-500/10 text-teal-600 border border-teal-500/10 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">
                  STEP 04
                </span>
                <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2 mt-2">
                  <ExternalLink className="h-4 w-4 text-teal-500" /> 관계부서 실시간 공유 및 배포
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Drive Save Card */}
                <div className="double-bezel-shell-light p-0.5 rounded-[1.8rem] flex flex-col justify-between">
                  <div className="double-bezel-core-light p-5 rounded-[calc(1.8rem-0.0625rem)] flex-1 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Save className="h-4 w-4 text-rose-500" /> [1번] Cloud 저장
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-1">Supabase DB 및 로컬 보관소에 안전하게 회의 원장을 보관합니다.</p>
                      
                      {/* Supabase Notice: .env 또는 localStorage에 URL 없을 때만 표시 */}
                      {!import.meta.env.VITE_SUPABASE_URL && !supabaseUrl && (
                        <div className="mt-3 p-2 bg-indigo-50/40 border border-indigo-100/60 rounded-xl text-[9px] text-indigo-700/90 font-medium flex items-center gap-1.5">
                          <Database className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
                          <span>Supabase Cloud DB 미연동 (설정 연결 필요)</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <button 
                        onClick={saveToDatabase}
                        disabled={!refinedContent}
                        className="w-full py-2.5 text-[10px] font-black uppercase tracking-wider bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-premium disabled:opacity-50 cursor-pointer"
                      >
                        보관 및 저장
                      </button>
                      <div className="text-[9px] text-zinc-500 font-semibold text-center">{saveStatus}</div>
                    </div>
                  </div>
                </div>

                {/* Mail Dispatch Card */}
                <div className="double-bezel-shell-light p-0.5 rounded-[1.8rem] flex flex-col justify-between">
                  <div className="double-bezel-core-light p-5 rounded-[calc(1.8rem-0.0625rem)] flex-1 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <Mail className="h-4 w-4 text-purple-500" /> [2번] 이메일 배포
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-1">지정한 관계부서 주소로 메일을 배포합니다.</p>
                    </div>
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        placeholder="이메일 주소 입력"
                        value={emailRecipient}
                        onChange={(e) => setEmailRecipient(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-2 text-[10px] focus:outline-none focus:border-purple-500"
                      />
                      <button 
                        onClick={sendEmail}
                        disabled={!refinedContent}
                        className="w-full py-2.5 text-[10px] font-black uppercase tracking-wider bg-purple-600 hover:bg-purple-500 text-white rounded-full transition-premium disabled:opacity-50 cursor-pointer"
                      >
                        이메일 발송
                      </button>
                      <div className="text-[9px] text-zinc-500 font-semibold text-center">{emailStatus}</div>
                    </div>
                  </div>
                </div>

                {/* Messenger Notification Card (Slack + KakaoTalk) */}
                <div className="double-bezel-shell-light p-0.5 rounded-[1.8rem] flex flex-col justify-between">
                  <div className="double-bezel-core-light p-5 rounded-[calc(1.8rem-0.0625rem)] flex-1 flex flex-col justify-between gap-4 text-left">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800 flex items-center gap-1.5">
                        <MessageSquare className="h-4 w-4 text-teal-500" /> [3번] 메신저 공유
                      </h4>
                      <p className="text-[10px] text-zinc-500 mt-1">Slack 웹훅 또는 카카오톡을 통해 보고서를 실시간 전송합니다.</p>
                    </div>
                    <div className="space-y-2">
                      <button 
                        onClick={sendSlack}
                        disabled={!refinedContent || !slackUrl}
                        className="w-full py-2.5 text-[10px] font-black uppercase tracking-wider bg-teal-600 hover:bg-teal-500 text-white rounded-full transition-premium disabled:opacity-50 cursor-pointer"
                      >
                        Slack 알림 전송
                      </button>
                      <button 
                        onClick={sendKakao}
                        disabled={!refinedContent}
                        className="w-full py-2.5 text-[10px] font-black uppercase tracking-wider btn-kakaotalk rounded-full transition-premium disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        카카오톡 공유
                      </button>
                      <div className="text-[9px] text-zinc-500 font-semibold text-center">{slackStatus}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* IDEA BANK TAB */}
        {activeTab === 'idea-bank' && (
          <div className="space-y-12 animate-fade-up">
            {/* Page Title */}
            <div className="text-center space-y-3">
              <span className="rounded-full px-3 py-1 text-[9px] uppercase tracking-[0.25em] font-black text-purple-600 bg-purple-500/5 border border-purple-500/10 inline-block">
                Synergy Idea Incubator
              </span>
              <h2 className="text-2xl font-display font-black tracking-tight text-zinc-900 leading-[1.3] pb-1">
                아이디어 뱅크 허브
              </h2>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">전사 미팅 데이터를 근거로 삼아 차세대 시너지 아이디어를 인큐베이팅하고 배포합니다.</p>
            </div>

            {/* Two-Track Incubator Form */}
            <div className="double-bezel-shell-light aurora-shadow-rose p-1 rounded-[2.5rem]">
              <div className="double-bezel-core-light p-6 rounded-[calc(2.5rem-0.25rem)] space-y-6 text-left">
                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                  <h3 className="text-xs font-black text-zinc-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" /> 새로운 아이디어 발제
                  </h3>
                  <button
                    onClick={() => {
                      setShowIdeaArchiveToggle(!showIdeaArchiveToggle);
                      setSelectedIdeaMeetings([]);
                    }}
                    className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full border transition-all duration-300 ${
                      showIdeaArchiveToggle 
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md' 
                        : 'bg-white text-purple-600 border-purple-200 hover:bg-purple-50/50'
                    }`}
                  >
                    {showIdeaArchiveToggle ? '✓ 아카이브 선택 닫기' : '+ 미팅 아카이브에서 근거자료 가져오기'}
                  </button>
                </div>

                {/* Conditional Archive Selector (Checkboxes Grid) */}
                {showIdeaArchiveToggle && (
                  <div className="bg-zinc-50/50 border border-zinc-100 p-4 rounded-2xl space-y-3">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">근거로 채택할 회의록 선택</span>
                    {archiveList.length === 0 ? (
                      <p className="text-[10px] text-zinc-400 font-semibold py-2">아카이브에 등록된 미팅 데이터가 없습니다.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-40 overflow-y-auto pr-1">
                        {archiveList.map((m) => {
                          const isChecked = selectedIdeaMeetings.includes(m.id);
                          return (
                            <label 
                              key={m.id} 
                              className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                                isChecked 
                                  ? 'bg-purple-500/5 border-purple-500/30' 
                                  : 'bg-white border-zinc-100 hover:border-zinc-200'
                              }`}
                            >
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {
                                  if (isChecked) {
                                    setSelectedIdeaMeetings(prev => prev.filter(id => id !== m.id));
                                  } else {
                                    setSelectedIdeaMeetings(prev => [...prev, m.id]);
                                  }
                                }}
                                className="mt-0.5 accent-purple-600 cursor-pointer"
                              />
                              <div>
                                <p className="text-[10px] font-extrabold text-zinc-800 line-clamp-1">{m.title}</p>
                                <span className="text-[8px] font-bold text-zinc-400">{m.date} · {m.attendees}</span>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">아이디어 제목</label>
                    <input 
                      type="text"
                      placeholder="예: 실시간 부서 협업 일정 리스크 경보 모델"
                      value={newIdeaTitle}
                      onChange={(e) => setNewIdeaTitle(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-premium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">핵심 개념 (Concept)</label>
                    <textarea 
                      rows="3"
                      placeholder="회의록을 근거로 분석하거나 수동으로 기획 중인 핵심 개념을 적어주세요."
                      value={newIdeaConcept}
                      onChange={(e) => setNewIdeaConcept(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-premium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-zinc-400 uppercase tracking-wider">추가 인간 통찰 (Human Insights - Optional)</label>
                    <textarea 
                      rows="2"
                      placeholder="발행하기 전에 나만의 직관적인 생각이나 추가 리소스 계획을 적어주세요."
                      value={newIdeaHumanInput}
                      onChange={(e) => setNewIdeaHumanInput(e.target.value)}
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 placeholder-zinc-400 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-premium"
                    />
                  </div>
                </div>

                {/* AI Inference Action vs Normal Action */}
                <div className="flex gap-3 pt-2">
                  {selectedIdeaMeetings.length > 0 ? (
                    <button
                      onClick={triggerAiIdeaExtraction}
                      disabled={isInferring}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black py-3 rounded-full text-xs hover:from-purple-700 hover:to-pink-600 transition-premium active:scale-[0.98] cursor-pointer text-center disabled:opacity-60 flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/10"
                    >
                      <Sparkles className="h-4 w-4" />
                      {isInferring ? 'AI 아이디어 추출 중...' : 'AI 아이디어 추출'}
                    </button>
                  ) : null}

                  <button
                    onClick={publishNewIdea}
                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-black py-3 rounded-full text-xs transition-premium active:scale-[0.98] cursor-pointer text-center shadow-md shadow-zinc-900/10"
                  >
                    전사 배포
                  </button>
                </div>

                {/* Skeleton UI when AI is inferring */}
                {isInferring && (
                  <div className="animate-pulse space-y-3 bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                    <div className="h-4 bg-zinc-200 rounded-md w-1/3"></div>
                    <div className="h-3 bg-zinc-250 rounded-md w-full"></div>
                    <div className="h-3 bg-zinc-250 rounded-md w-5/6"></div>
                  </div>
                )}

              </div>
            </div>

            {/* Global Social Feed */}
            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-purple-600" /> 전사 시너지 아이디어 피드 ({ideas.length}개)
                </h3>
              </div>

              {ideas.length === 0 ? (
                <div className="double-bezel-shell-light p-0.5 rounded-[2rem] w-full text-center py-10">
                  <div className="double-bezel-core-light p-6 rounded-[calc(2rem-0.0625rem)] text-zinc-400 font-bold text-xs space-y-1">
                    <p>등록된 시너지 아이디어가 아직 없습니다.</p>
                    <p className="text-[10px] text-zinc-400/70 font-semibold">회의록 데이터를 연결하여 첫 번째 AI 추출 아이디어를 전사 배포해보세요!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {ideas.map((idea) => (
                    <div key={idea.id} id={`idea-card-${idea.id}`} className="double-bezel-shell-light p-0.5 rounded-[2rem] hover:shadow-lg transition-all duration-300">
                      <div className="double-bezel-core-light p-5 rounded-[calc(2rem-0.0625rem)] text-left space-y-4">
                        
                        {/* Feed Header */}
                        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-zinc-100 pb-3">
                          <div className="flex items-center gap-2">
                            {idea.isDataBased ? (
                              <span className="text-[8px] bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black px-2 py-0.5 rounded-full shadow-sm shadow-purple-500/10">
                                🎯 데이터 기반
                              </span>
                            ) : (
                              <span className="text-[8px] bg-zinc-100 text-zinc-500 font-black px-2 py-0.5 rounded-full border border-zinc-200">
                                💡 일반 아이디어
                              </span>
                            )}
                            
                            {/* Citation Link */}
                            {idea.isDataBased && idea.citations && idea.citations.map(cit => (
                              <button
                                key={cit.id}
                                onClick={() => {
                                  const targetMeet = archiveList.find(m => m.id === cit.id);
                                  if (targetMeet) {
                                    setSelectedMeeting(targetMeet);
                                    setActiveTab('archive');
                                  }
                                }}
                                className="text-[8px] text-purple-600 hover:text-purple-700 bg-purple-50/50 hover:bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full font-bold transition-premium-fast"
                              >
                                근거: {cit.title}
                              </button>
                            ))}
                          </div>
                          
                          <span className="text-[9px] text-zinc-400 font-bold">{idea.date}</span>
                        </div>

                        {/* Concept body */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-black text-zinc-900">{idea.title}</h4>
                          <p className="text-xs text-zinc-700 font-medium leading-relaxed bg-zinc-50/40 p-3 rounded-xl border border-zinc-100/50 whitespace-pre-wrap">{idea.concept}</p>
                          {idea.humanInput && (
                            <div className="border-l-2 border-purple-500 pl-3.5 py-1">
                              <span className="text-[8px] font-black text-purple-600 uppercase tracking-widest block mb-0.5">인간의 통찰 추가의견</span>
                              <p className="text-xs text-zinc-600 font-medium italic">{idea.humanInput}</p>
                            </div>
                          )}
                        </div>

                        {/* Author info & Likes / Actions */}
                        {(() => {
                          const currentUserId = user?.id || userProfile?.fullName || 'demo-user';
                          const hasLiked = (idea.likedBy || []).includes(currentUserId);
                          const isAdmin = !userProfile || userProfile.role === 'admin' || userProfile.departmentName === '기획부';

                          return (
                            <div className="flex justify-between items-center pt-2 border-t border-zinc-50">
                              <div className="flex items-center gap-1.5">
                                <span className="text-[9px] font-black text-zinc-700">{idea.authorName}</span>
                                <span className="text-[9px] font-black bg-rose-500/10 text-rose-600 px-1.5 py-0.5 rounded-md">{idea.authorDept}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleLikeIdea(idea.id)}
                                  className={`flex items-center gap-1 text-[10px] font-black px-3 py-1.5 rounded-full border transition-all duration-300 cursor-pointer active:scale-95 ${
                                    hasLiked 
                                      ? "bg-rose-500 text-white border-rose-500 hover:bg-rose-600 shadow-sm shadow-rose-500/20" 
                                      : "bg-rose-50/50 hover:bg-rose-100/70 text-rose-600 border-rose-100"
                                  }`}
                                >
                                  {hasLiked ? "❤️" : "🤍"} 좋아요 {idea.likes}
                                </button>

                                {isAdmin && (
                                  <button
                                    onClick={() => handleDeleteIdea(idea.id)}
                                    className="flex items-center gap-1 text-[10px] font-black bg-zinc-50 hover:bg-rose-500 hover:text-white text-zinc-600 px-3 py-1.5 rounded-full border border-zinc-200 hover:border-rose-500 transition-all duration-300 active:scale-95 cursor-pointer"
                                  >
                                    🗑️ 삭제
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })()}

                        {/* Comment Threads */}
                        <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100/70 space-y-3">
                          <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">댓글 피드백 ({idea.comments.length}개)</span>
                          
                          {idea.comments.length > 0 && (
                            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                              {idea.comments.map(c => (
                                <div key={c.id} className="bg-white p-2.5 rounded-xl border border-zinc-100 text-[10px] leading-relaxed">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-extrabold text-zinc-800">{c.author}</span>
                                    <span className="text-[8px] text-zinc-400 font-medium">{c.date}</span>
                                  </div>
                                  <p className="text-zinc-600 font-semibold">{c.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* New comment input */}
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const formEl = e.currentTarget;
                              const inputEl = formEl.elements.namedItem('commentText');
                              handleAddComment(idea.id, inputEl.value);
                              formEl.reset();
                            }}
                            className="flex gap-2"
                          >
                            <input 
                              name="commentText"
                              type="text" 
                              placeholder="아이디어에 대한 피드백이나 리소스 커밋을 남겨주세요..."
                              className="flex-1 bg-white border border-zinc-100 rounded-xl px-3 py-2 text-[10px] focus:outline-none focus:border-purple-500"
                            />
                            <button 
                              type="submit"
                              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-xl text-[10px] font-black cursor-pointer transition-premium"
                            >
                              등록
                            </button>
                          </form>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ARCHIVE TAB */}
        {activeTab === 'archive' && (
          <div className="space-y-8 animate-fade-up">
            
            {/* Filter bar */}
            <div className="double-bezel-shell-light p-0.5 rounded-[2rem] w-full">
              <div className="double-bezel-core-light p-5 rounded-[calc(2rem-0.0625rem)] flex flex-col md:flex-row justify-between items-center gap-4 text-left">
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest mr-1">조회 기간</span>
                  <div className="flex items-center gap-1.5 bg-zinc-50 border border-zinc-100 rounded-xl p-1 px-2.5">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="bg-transparent border-none text-xs focus:outline-none text-zinc-700 font-bold w-28"
                    />
                    <span className="text-zinc-300 text-xs font-bold">~</span>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="bg-transparent border-none text-xs focus:outline-none text-zinc-700 font-bold w-28"
                    />
                  </div>
                  
                  {/* Quick Period Buttons */}
                  <div className="flex gap-1 bg-zinc-100 p-0.5 rounded-lg">
                    {[
                      { label: '1개월', value: 1 },
                      { label: '3개월', value: 3 },
                      { label: '6개월', value: 6 }
                    ].map(btn => (
                      <button
                        key={btn.value}
                        type="button"
                        onClick={() => setPeriodFilter(btn.value)}
                        className="px-2.5 py-1 rounded-md text-[10px] font-bold text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-50 shadow-sm border border-zinc-200/50 transition-premium-fast active:scale-95"
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                <button 
                  type="button"
                  onClick={resetPeriodFilter}
                  className="text-xs text-rose-500 hover:text-rose-600 font-bold transition-premium-fast shrink-0"
                >
                  필터 초기화
                </button>
              </div>
            </div>

            {/* List Table */}
            <div className="double-bezel-shell-light p-0.5 rounded-[2rem]">
              <div className="double-bezel-core-light rounded-[calc(2rem-0.0625rem)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50 text-zinc-500 border-b border-zinc-100 font-bold uppercase tracking-wider">
                        <th className="p-4 w-28">회의 일시</th>
                        <th className="p-4">회의 안건 타이틀</th>
                        <th className="p-4 w-32">참석 인원</th>
                        <th className="p-4 w-24 text-center">동작</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {(() => {
                        const filteredList = archiveList.filter(item => {
                          if (!item.date) return true;
                          if (startDate && item.date < startDate) return false;
                          if (endDate && item.date > endDate) return false;
                          return true;
                        });
                        
                        if (filteredList.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-zinc-400 font-bold">
                                {archiveList.length === 0 ? '보관된 회의 기록이 아직 존재하지 않습니다.' : '검색 기간에 해당하는 회의 기록이 없습니다.'}
                              </td>
                            </tr>
                          );
                        }
                        
                        return filteredList.map((item, idx) => (
                          <tr 
                            key={idx} 
                            className="hover:bg-zinc-50/50 transition-premium-fast cursor-pointer" 
                            onClick={() => setSelectedMeeting(prev => prev && prev.id === item.id ? null : item)}
                          >
                            <td className="p-4 font-mono text-zinc-400">{item.date}</td>
                            <td className="p-4">
                              <div className="flex flex-col gap-1">
                                <span className="font-bold text-zinc-800 text-sm leading-snug">{item.title}</span>
                                <div className="flex gap-2 mt-0.5">
                                  <span className="bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full text-[8px] font-bold">📁 DB</span>
                                  {item.synergyAnalysis && (item.synergyAnalysis.hasConflict || item.synergyAnalysis.hasSynergy) && (
                                    <span className="bg-rose-50 text-rose-600 border border-rose-100 px-2 py-0.5 rounded-full text-[8px] font-bold">⚡ AI 시너지 연계</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-zinc-500 font-semibold truncate max-w-[120px]">{item.attendees}</td>
                            <td className="p-4 text-center">
                              <div className="flex justify-center items-center gap-3">
                                <button 
                                  onClick={(e) => { e.stopPropagation(); setSelectedMeeting(prev => prev && prev.id === item.id ? null : item); }}
                                  className="text-rose-500 hover:text-rose-600 font-bold"
                                >
                                  보기
                                </button>
                                <button 
                                  onClick={(e) => { e.stopPropagation(); deleteRecord(item.id); }}
                                  className="text-rose-400 hover:text-red-600 font-bold transition-premium-fast"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ));
                      })()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Selected Meeting Detail Overlay */}
            {selectedMeeting && (
              <div className="double-bezel-shell-light p-1 rounded-[2.5rem] text-left">
                <div className="double-bezel-core-light p-6 md:p-8 rounded-[calc(2.5rem-0.375rem)] space-y-6">
                  <div className="flex justify-between items-center border-b border-zinc-100 pb-4">
                    <div>
                      <h3 className="text-lg font-display font-black text-zinc-900">{selectedMeeting.title}</h3>
                      <p className="text-[10px] text-zinc-400 font-semibold mt-1">🗓️ {selectedMeeting.date} | 👤 {selectedMeeting.attendees}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedMeeting(null)}
                      className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 px-4 py-2 rounded-full text-[10px] font-bold transition-premium-fast"
                    >
                      목록으로
                    </button>
                  </div>

                  {selectedMeeting.synergyAnalysis && (selectedMeeting.synergyAnalysis.hasConflict || selectedMeeting.synergyAnalysis.hasSynergy) && (
                    <div className="bg-zinc-50 border border-rose-100 p-4 rounded-2xl space-y-3">
                      <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest">AI 부서 협업 매핑 정보</h4>
                      {selectedMeeting.synergyAnalysis.hasConflict && (
                        <p className="text-xs text-zinc-700 bg-rose-50/50 p-3 rounded-lg border border-rose-200/30">🚨 <b>일정 충돌 감지:</b> {selectedMeeting.synergyAnalysis.conflictDescription}</p>
                      )}
                      {selectedMeeting.synergyAnalysis.hasSynergy && (
                        <p className="text-xs text-zinc-700 bg-teal-50/20 p-3 rounded-lg border border-teal-200/20">💡 <b>솔루션 연계:</b> {selectedMeeting.synergyAnalysis.synergyDescription}</p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">회의록 본문</span>
                    <div className="bg-zinc-50 p-4 rounded-xl text-xs leading-relaxed text-zinc-700 font-mono whitespace-pre-wrap border border-zinc-100">
                      {selectedMeeting.content}
                    </div>
                  </div>

                  {selectedMeeting.actionItems && selectedMeeting.actionItems.length > 0 && (
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Action Items</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedMeeting.actionItems.map((item, idx) => (
                          <div key={idx} className="p-3.5 bg-zinc-50 border border-zinc-100 rounded-xl">
                            <p className="text-xs font-bold text-zinc-800">{item.task}</p>
                            <div className="flex justify-between items-center mt-2 text-[10px] font-semibold text-zinc-400">
                              <span>👤 담당: {item.assignee}</span>
                              <span>📅 기한: {item.dueDate}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="double-bezel-shell-light p-1 rounded-[2.5rem] animate-fade-up max-w-2xl mx-auto">
            <div className="double-bezel-core-light p-6 md:p-8 rounded-[calc(2.5rem-0.375rem)] space-y-6 text-left">
              <div>
                <h3 className="text-base font-display font-black text-zinc-800 flex items-center gap-2">⚙️ 연동 및 시스템 세팅</h3>
                <p className="text-xs text-zinc-500 mt-1">메신저 알림 연동을 설정합니다. AI/DB는 기본 연동되어 있습니다.</p>
              </div>
              
              <div className="divider border-b border-zinc-100"></div>

              {/* 기본 연동 상태 표시 (읽기 전용) */}
              <div className="space-y-3">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">기본 연동 현황</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Gemini AI', icon: '🤖', connected: !!geminiKey },
                    { label: 'Supabase DB', icon: '🗄️', connected: !!(import.meta.env.VITE_SUPABASE_URL) },
                    { label: 'Supabase Auth', icon: '🔐', connected: !!(import.meta.env.VITE_SUPABASE_ANON_KEY) },
                  ].map(({ label, icon, connected }) => (
                    <div key={label} className={`flex items-center gap-2 p-3 rounded-xl border ${connected ? 'bg-emerald-50/40 border-emerald-100 text-emerald-700' : 'bg-zinc-50 border-zinc-100 text-zinc-400'}`}>
                      <span>{icon}</span>
                      <span className="text-[10px] font-bold">{label}</span>
                      <span className={`ml-auto text-[9px] font-black px-1.5 py-0.5 rounded-full ${connected ? 'bg-emerald-500/10 text-emerald-600' : 'bg-zinc-100 text-zinc-400'}`}>
                        {connected ? '연동됨' : '미연동'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="divider border-b border-zinc-100"></div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-zinc-500 pl-1">Slack Incoming Webhook URL</span>
                    <input 
                      type="text" 
                      value={slackUrl}
                      onChange={(e) => setSlackUrl(e.target.value)}
                      placeholder="https://hooks.slack.com/services/..."
                      className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 focus:outline-none focus:border-rose-500 transition-premium"
                    />
                    <p className="text-[9px] text-zinc-400 pl-1">채널 공유를 위한 웹훅 주소입니다.</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-zinc-500 pl-1">Kakao JavaScript API Key</span>
                    <input 
                      type="text" 
                      value={kakaoKey}
                      onChange={(e) => setKakaoKey(e.target.value)}
                      placeholder="카카오 JavaScript 키 입력"
                      className="bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs text-zinc-800 focus:outline-none focus:border-rose-500 transition-premium"
                    />
                    <p className="text-[9px] text-zinc-400 pl-1">공식 카카오톡 공유 기능 활성화를 위한 JavaScript 키입니다.</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-100">
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-zinc-700">부서 시너지 데모 모드</span>
                      <span className="text-[9px] text-zinc-400 mt-0.5">과거 데이터가 없을 때 AI 교차 분석 예시를 연계해 줍니다.</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={isDemoMode}
                      onChange={(e) => setIsDemoMode(e.target.checked)}
                      className="w-4 h-4 accent-rose-500 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button 
                  onClick={saveSettings}
                  className="bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-black px-8 py-3 rounded-full text-xs transition-premium cursor-pointer"
                >
                  모든 설정 저장
                </button>
                <span className="text-xs font-bold text-zinc-600">{settingsStatus}</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Onboarding Dialog */}
      {showOnboarding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-900/30 backdrop-blur-md">
          <div className="double-bezel-shell-light aurora-shadow-indigo p-1 rounded-[2rem] w-full max-w-sm animate-fade-up">
            <div className="double-bezel-core-light p-6 rounded-[calc(2rem-0.25rem)] space-y-4 text-left">
              <div>
                <span className="text-[9px] bg-indigo-500/10 text-indigo-600 border border-indigo-500/10 px-2 py-0.5 rounded-md font-black uppercase tracking-wider">ONBOARDING</span>
                <h3 className="text-base font-display font-black text-zinc-800 mt-2">프로필 설정</h3>
                <p className="text-[10px] text-zinc-500 mt-1">성함과 부서를 등록하여 격리된 안전한 부서 환경을 구성합니다.</p>
              </div>

              <form onSubmit={handleOnboardingSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">이름 (본명)</span>
                  <input 
                    type="text" 
                    required
                    value={onboardingName}
                    onChange={(e) => setOnboardingName(e.target.value)}
                    placeholder="홍길동" 
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500 text-zinc-800"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">소속 부서</span>
                  <select 
                    required
                    value={onboardingDept}
                    onChange={(e) => { setOnboardingDept(e.target.value); setCustomDeptName(''); }}
                    className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500 text-zinc-700"
                  >
                    <option value="">부서 선택</option>
                    {departments.map((dept) => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                    <option value="etc">기타 (직접입력)</option>
                  </select>
                </div>

                {onboardingDept === 'etc' && (
                  <div className="flex flex-col gap-1 animate-fade-up">
                    <span className="text-[10px] font-bold text-zinc-400 pl-1 uppercase tracking-wider">부서명 직접 입력</span>
                    <input 
                      type="text" 
                      required
                      value={customDeptName}
                      onChange={(e) => setCustomDeptName(e.target.value)}
                      placeholder="부서명을 입력하세요" 
                      className="w-full bg-zinc-50 border border-zinc-100 rounded-xl p-3 text-xs focus:outline-none focus:border-rose-500 text-zinc-800"
                    />
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-3 text-xs font-black uppercase tracking-wider bg-zinc-800 hover:bg-zinc-900 text-white rounded-full transition-premium cursor-pointer text-center"
                >
                  플랫폼 시작하기
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-zinc-100 bg-white py-6 text-center text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
        © 2026 Meeting Intelligence Inc. Built with React & Tailwind CSS. Powered by Gemini.
      </footer>
    </div>
  );
}

export default App;
