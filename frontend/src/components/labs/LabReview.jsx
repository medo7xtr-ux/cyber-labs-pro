// frontend/src/components/labs/LabReview.jsx
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Rating,
  TextField,
  Button,
  Avatar,
  Paper,
  Divider
} from '@mui/material';
import { Star as StarIcon, Person as PersonIcon } from '@mui/icons-material';

const LabReview = ({ labId, reviews, onAddReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(-1);

  const labels = {
    0: 'لم يتم التقييم',
    1: 'سيء جداً',
    2: 'سيء',
    3: 'متوسط',
    4: 'جيد',
    5: 'ممتاز',
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onAddReview({ rating, comment });
      setRating(0);
      setComment('');
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        تقييمات المعمل
      </Typography>
      
      {/* نموذج إضافة تقييم */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          أضف تقييمك
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Rating
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            onChangeActive={(event, newHover) => setHover(newHover)}
            icon={<StarIcon fontSize="inherit" />}
            emptyIcon={<StarIcon fontSize="inherit" style={{ opacity: 0.55 }} />}
          />
          {rating !== null && (
            <Box sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : rating]}</Box>
          )}
        </Box>
        <TextField
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="شارك تجربتك مع هذا المعمل..."
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          إرسال التقييم
        </Button>
      </Paper>

      {/* عرض التقييمات */}
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {review.user.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {new Date(review.created_at).toLocaleDateString('ar-SA')}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body2" sx={{ mt: 1 }}>
              {review.comment}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography color="text.secondary" align="center">
          لا توجد تقييمات بعد. كن أول من يقيم هذا المعمل!
        </Typography>
      )}
    </Box>
  );
};

export default LabReview;