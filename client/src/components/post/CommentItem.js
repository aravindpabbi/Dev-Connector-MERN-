import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteComment } from "../../actions/post";
import formatDate from "../../utils/formatDate";

const CommentItem = ({
	deleteComment,
	postId,
	auth,
	comment: { _id, text, name, avatar, user, date },
}) => {
	return (
		<div className='post bg-white p-1 my-1'>
			<div>
				<Link to={`/profile/${user}`}>
					<img className='round-img' src={avatar} alt='' />
					<h4>{name}</h4>
				</Link>
			</div>
			<div>
				<p className='my-1'>{text}</p>
				<p className='post-date'>Posted on {formatDate(date)}</p>
				{!auth.loading && user === auth.user._id && (
					<button
						onClick={(e) => deleteComment(postId, _id)}
						type='button'
						className='btn btn-danger'
					>
						<i className='fas fa-times' />
					</button>
				)}
			</div>
		</div>
	);
};

CommentItem.propTypes = {
	postId: PropTypes.number.isRequired,
	deleteComment: PropTypes.func.isRequired,
	comment: PropTypes.object.isRequired,
	auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
	auth: state.auth,
});
export default connect(mapStateToProps, { deleteComment })(CommentItem);
