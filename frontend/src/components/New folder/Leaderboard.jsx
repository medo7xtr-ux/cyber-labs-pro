// frontend/src/components/leaderboard/Leaderboard.jsx
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Avatar, Chip,
  ToggleButton, ToggleButtonGroup, TextField, Box
} from '@mui/material';
import { TrendingUp, MilitaryTech, EmojiEvents } from '@mui/icons-material';

function Leaderboard() {
  const [timeframe, setTimeframe] = useState('all');
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  const leaderboardData = [
    {
      rank: 1,
      user: { username: 'أحمد', avatar: '', points: 4500 },
      completedLabs: 42,
      accuracy: 98,
      streak: 28
    },
    // ... بيانات أخرى
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <ToggleButtonGroup
            value={timeframe}
            exclusive
            onChange={(e, v) => setTimeframe(v)}
          >
            <ToggleButton value="daily">يومي</ToggleButton>
            <ToggleButton value="weekly">أسبوعي</ToggleButton>
            <ToggleButton value="monthly">شهري</ToggleButton>
            <ToggleButton value="all">كل الوقت</ToggleButton>
          </ToggleButtonGroup>
          
          <ToggleButtonGroup
            value={category}
            exclusive
            onChange={(e, v) => setCategory(v)}
          >
            <ToggleButton value="all">الكل</ToggleButton>
            <ToggleButton value="web">أمن الويب</ToggleButton>
            <ToggleButton value="network">الشبكات</ToggleButton>
            <ToggleButton value="crypto">التشفير</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <TextField
          placeholder="بحث عن لاعب..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>الترتيب</TableCell>
              <TableCell>المستخدم</TableCell>
              <TableCell>النقاط</TableCell>
              <TableCell>المعامل المكتملة</TableCell>
              <TableCell>الدقة</TableCell>
              <TableCell>المتابعة</TableCell>
              <TableCell>الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaderboardData.map((row, index) => (
              <TableRow key={row.user.username}>
                <TableCell>
                  {row.rank <= 3 ? (
                    <Chip
                      icon={<EmojiEvents />}
                      label={row.rank}
                      color={
                        row.rank === 1 ? 'warning' :
                        row.rank === 2 ? 'secondary' :
                        'primary'
                      }
                    />
                  ) : (
                    row.rank
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar src={row.user.avatar}>
                      {row.user.username.charAt(0)}
                    </Avatar>
                    <Box>
                      <strong>{row.user.username}</strong>
                      <br />
                      <Chip 
                        icon={<MilitaryTech />}
                        label="المستوى الذهبي"
                        size="small"
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    icon={<TrendingUp />}
                    label={row.user.points}
                    color="success"
                  />
                </TableCell>
                <TableCell>{row.completedLabs}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {row.accuracy}%
                    <Box sx={{ width: 100, height: 8, bgcolor: 'grey.300', borderRadius: 4 }}>
                      <Box 
                        sx={{ 
                          width: `${row.accuracy}%`, 
                          height: '100%', 
                          bgcolor: row.accuracy > 90 ? 'success.main' : 'warning.main',
                          borderRadius: 4
                        }}
                      />
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={`${row.streak} يوم`}
                    color={row.streak > 7 ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell>
                  <Button variant="outlined" size="small">
                    عرض الملف
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}