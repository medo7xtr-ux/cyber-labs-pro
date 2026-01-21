// frontend/src/components/achievements/AchievementBadge.jsx
import React from 'react';
import { Card, CardContent, Typography, Box, Tooltip } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';

const AchievementBadge = ({ achievement, earned }) => {
  return (
    <Tooltip title={achievement.description}>
      <Card 
        sx={{ 
          width: 120, 
          height: 140,
          opacity: earned ? 1 : 0.5,
          textAlign: 'center',
          position: 'relative'
        }}
      >
        <CardContent>
          <Box sx={{ color: earned ? '#ffd700' : '#666', fontSize: 40 }}>
            <TrophyIcon fontSize="inherit" />
          </Box>
          <Typography variant="body2" sx={{ mt: 1, fontWeight: 'bold' }}>
            {achievement.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {achievement.points_required} نقطة
          </Typography>
          {earned && (
            <Box
              sx={{
                position: 'absolute',
                top: -5,
                right: -5,
                bgcolor: 'success.main',
                color: 'white',
                borderRadius: '50%',
                width: 24,
                height: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12
              }}
            >
              ✓
            </Box>
          )}
        </CardContent>
      </Card>
    </Tooltip>
  );
};

export default AchievementBadge;