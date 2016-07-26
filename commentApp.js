class Comment extends React.Component {
    _handleDelete(){
        event .preventDefault();
        const com = {
            id: this.props.id,
            name: this.props.name,
            body: this.props.body
        };
        this.props.onDelete(com);
    }
    render() {
        return (
            <div className="comment panel col-md-12">
                <div className="comment-header panel-heading">Name : {this.props.name}</div>
                <br />
                <div className="comment-body panel-body  col-md-12">
                    {this.props.body}
                </div>
                <div className="comment-footer col-md-12">
                    <a href="#"
                       onClick={this._handleDelete.bind(this)}
                       className ="comment-footer-delete btn btn-sm btn-success pull-right">
                        Delete comment
                    </a>
                </div>
            </div>
        );
    }
}

class CommentBox extends React.Component {
    constructor(){
        super();
        this.state = {
            showComments: false
        };
    }
    _deleteComment(that){
        this.props.deleteComment(that)
    }

    _getComments(){
        return this.props.comments.map((comment) => {
            return (
                <Comment
                    name={comment.name}
                    body={comment.body}
                    id={comment.id}
                    key={comment.id}
                    onDelete={this._deleteComment.bind(this)}/>
            );
        })
    }
    _getCommentsTitle(commentCount) {
        if (commentCount === 0) {
            return 'No comments yet';
        } else if (commentCount === 1) {
            return '1 Comment';
        } else {
            return `${commentCount} Comments`;
        }
    }
    _handleClick(){
        this.setState({
            showComments: !this.state.showComments
        });
    }
    render() {
        const comments = this._getComments();
        let commentNodes;
        let buttonText = 'Show comments';
        if (this.state.showComments) {
            buttonText = 'HIDE COMMENTS';
        }else{
            buttonText = 'SHOW COMMENTS';
        }
        if(this.state.showComments){
            commentNodes = <div className="comment-list"> {comments}</div>
        }
        return (
            <div className="comment-box row">
                <div className="comment-box-header">
                    <h3>
                        {this._getCommentsTitle(comments.length)}
                        <button className="btn btn-success pull-right" onClick={this._handleClick.bind(this)}>{buttonText}</button>
                    </h3>
                </div>
                {commentNodes}
            </div>
        );
    }
}

class CommentForm extends React.Component {
    _handleSubmit(event){
        event.preventDefault();
        let name = this._name;
        let body = this._body;
        this.props.addComment(name.value, body.value);
        this._name.value = "";
        this._body.value = "";
    }
    render() {
        return (
            <form className="form form-area row" onSubmit={this._handleSubmit.bind(this)}>
                <div className="new-comment">New Comment</div>
                <label className="label">name</label>
                <input type="text"
                       className="form-control"
                       ref={(input) => this._name = input}
                       id="name"
                       name="name"
                       placeholder="Name:" />
                <br />
                <label className="label">Comment</label>
                <textarea
                    className="form-control"
                    type="textarea"
                    ref={(textarea) => this._body = textarea}
                    placeholder="Comment:"
                    id="message"
                    maxlength="140"
                    rows="7">
                </textarea>
                <button type="submit" className="btn btn-warning btn-submit">Post comment</button>
            </form>
        );
    }
}

class CommentApp extends React.Component {
    constructor(){
        super();
        this.state = {
            comments : []
        };
    }
    _fetchComments() {
        jQuery.ajax({
            method: 'GET',
            url: 'http://jsonplaceholder.typicode.com/comments',
            success: (comments) => {
                this.setState(
                    {comments : comments}
                )
            }
        });
    }
    componentWillMount(){
       this._fetchComments();
    }

    _addComment(name, body){
        const comment ={
            id: Date.now(),
            name,
            body
        };
        this.setState({comments: [comment].concat(this.state.comments)})
    }

    _deleteComment(commentToDel){
        let commentDelIndex = this.state.comments.findIndex(comment => comment.id == commentToDel.id);
        this.state.comments.splice(commentDelIndex, 1);
        this.setState({comments: this.state.comments});
    }
    render() {
        return (
            <div className="container">
                <h1>JOIN THE DISCUSSION</h1>
                <CommentForm addComment={this._addComment.bind(this)}/>
                <CommentBox deleteComment={this._deleteComment.bind(this)} comments={this.state.comments}/>
            </div>
        );
    }
}
ReactDOM.render(
<CommentApp />, document.getElementById('container')
);
