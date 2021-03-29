$(function(){
    load();
    // 输入数据
    $('#title').on('keyup',function(e){
        if(e.keyCode === 13){
            var data = getdata();
            data.push({ title: $(this).val(), done: false });
            savedata(data);
            load();
            $(this).val("");
        }
    })
    // 获取数据
    function getdata(){
        var data = localStorage.getItem("todo");
        if(data != null)
            return JSON.parse(data);
        else
            return [];
    }

    // 保存数据
    function savedata(data){
        localStorage.setItem("todo", JSON.stringify(data));
    }

    // 渲染页面
    function load(){
        var data = getdata();
        $("ol,ul").empty();
        var todoCount = 0; // 正在进行的个数
        var doneCount = 0; // 已经完成的个数
        $.each(data,function(i,n){
            if(n.done){
                $("ul").prepend("<li><input type='checkbox' checked='checked' > <p>" + n.title + "</p> <a href='javascript:;' id=" + i + " ></a></li>");
                doneCount++;
            }else{
                $("ol").prepend("<li><input type='checkbox'> <p>"+ n.title +"</p> <a href='javascript:;' id=" + i + " ></a></li>");
                todoCount++;
            }
        })
        $("#todocount").text(todoCount);
        $("#donecount").text(doneCount);
    }

    // 切换 已完成 未完成 状态
    $("ol, ul").on("click","input",function(){
        var idx = $(this).siblings("a").prop("id");
        var data = getdata();
        data[idx].done = $(this).prop("checked");
        savedata(data);
        load();
    })
    
    //  删除
    $("ol, ul").on("click","a",function(){
        var idx = $(this).prop("id");
        var data = getdata();      
        data.splice(idx,1);
        savedata(data);
        load();
    })

    // 修改
    $("ol, ul").on("dblclick","p",function(){
        var data = getdata();
        var idx = $(this).siblings("a").prop("id");
        var str = this.innerHTML;
        //防止双击选中文字
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        this.innerHTML = '<input type="text" />';
        var input = this.children[0];
        input.value = str;
        input.select();
        // 当我们离开文本框就把文本框里面的值给p
        input.onblur = function () {
            data[idx].title = this.value; //此时文本会替换input文本框
            savedata(data);
            load();
        };

        input.onkeyup = function (e) {
            if (e.keyCode === 13) {
                // 手动调用表单失去焦点事件  不需要鼠标离开操作
                this.blur();
            }
        }
    })
});